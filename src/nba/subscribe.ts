import type { Client } from 'discord.js';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { enrichStat, getRecentStats, getStatById } from '../apis/nba.js';
import { getPostedStatMessage, isStatPosted, markStatPosted } from '../db/nbaQueries.js';
import { isSupabaseConfigured, supabase } from '../supabase/index.js';
import type { PlayerGameStats, PlayerGameStatsWithDetails } from '../types/index.js';
import { postGameStats, updateGameStatsMessage } from './postGameStats.js';

const BACKFILL_HOURS = 24;

async function loadFreshStat(stat: PlayerGameStats): Promise<PlayerGameStatsWithDetails> {
	const fresh = await getStatById(stat.id);
	return fresh ?? enrichStat(stat);
}

async function processStat(client: Client, stat: PlayerGameStats): Promise<void> {
	const enriched = await loadFreshStat(stat);

	if (isStatPosted(stat.id)) {
		const posted = getPostedStatMessage(stat.id);
		if (posted) {
			await updateGameStatsMessage(
				client,
				enriched,
				posted.messageId,
				posted.channelId,
			);
		}
		return;
	}

	const messageId = await postGameStats(client, enriched);
	if (messageId && process.env.NBA_CHANNEL_ID) {
		markStatPosted(stat.id, messageId, process.env.NBA_CHANNEL_ID);
	}
}

async function backfillRecentStats(client: Client): Promise<void> {
	const since = new Date(Date.now() - BACKFILL_HOURS * 60 * 60 * 1000).toISOString();

	try {
		const stats = await getRecentStats(since);
		for (const stat of stats) {
			await processStat(client, stat);
		}
	} catch (error) {
		console.error('NBA backfill failed:', error);
	}
}

function handleChange(
	client: Client,
	payload: RealtimePostgresChangesPayload<{ [key: string]: unknown }>,
) {
	const stat = payload.new as unknown as PlayerGameStats;
	if (!stat?.id) {
		return;
	}

	void processStat(client, stat);
}

export async function startNbaPosting(client: Client): Promise<void> {
	if (!isSupabaseConfigured || !supabase) {
		console.warn('Supabase is not configured; NBA posting disabled.');
		return;
	}

	if (!process.env.NBA_CHANNEL_ID) {
		console.warn('NBA_CHANNEL_ID is not set; NBA posting disabled.');
		return;
	}

	await backfillRecentStats(client);

	supabase
		.channel('player_game_stats_changes')
		.on(
			'postgres_changes',
			{
				event: 'INSERT',
				schema: 'public',
				table: 'player_game_stats',
			},
			(payload) => handleChange(client, payload),
		)
		.on(
			'postgres_changes',
			{
				event: 'UPDATE',
				schema: 'public',
				table: 'player_game_stats',
			},
			(payload) => handleChange(client, payload),
		)
		.subscribe((status) => {
			if (status === 'SUBSCRIBED') {
				console.log('NBA Realtime subscription active.');
			} else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
				console.error(`NBA Realtime subscription error: ${status}`);
			}
		});
}

export async function stopNbaPosting(): Promise<void> {
	if (supabase) {
		await supabase.removeAllChannels();
	}
}
