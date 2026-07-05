import type { Client } from 'discord.js';
import type { RealtimePostgresInsertPayload } from '@supabase/supabase-js';
import { enrichStat } from '../apis/nba.js';
import { getRecentStats } from '../apis/nba.js';
import { isStatPosted, markStatPosted } from '../db/nbaQueries.js';
import { isSupabaseConfigured, supabase } from '../supabase/index.js';
import type { PlayerGameStats } from '../types/index.js';
import { postGameStats } from './postGameStats.js';

const BACKFILL_HOURS = 24;

async function processStat(client: Client, stat: PlayerGameStats): Promise<void> {
	if (isStatPosted(stat.id)) {
		return;
	}

	const enriched = enrichStat(stat);
	const posted = await postGameStats(client, enriched);
	if (posted) {
		markStatPosted(stat.id);
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

function handleInsert(client: Client, payload: RealtimePostgresInsertPayload<{ [key: string]: unknown }>) {
	const stat = payload.new as unknown as PlayerGameStats;
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

	const channel = supabase
		.channel('player_game_stats_inserts')
		.on(
			'postgres_changes',
			{
				event: 'INSERT',
				schema: 'public',
				table: 'player_game_stats',
			},
			(payload) => handleInsert(client, payload),
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
