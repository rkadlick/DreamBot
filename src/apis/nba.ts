import { NBA_TEAMS } from '../data/teams.js';
import { supabase } from '../supabase/index.js';
import type { PlayerGameStats, PlayerGameStatsWithDetails } from '../types/index.js';

function requireSupabase() {
	if (!supabase) {
		throw new Error('Supabase is not configured');
	}
	return supabase;
}

export function enrichStat(stat: PlayerGameStats): PlayerGameStatsWithDetails {
	const opponentTeamId = stat.opponent_team_id as keyof typeof NBA_TEAMS | undefined;
	return {
		...stat,
		opponent_team: opponentTeamId ? NBA_TEAMS[opponentTeamId] : undefined,
	};
}

export async function getAllStats(): Promise<PlayerGameStatsWithDetails[]> {
	const client = requireSupabase();
	const { data, error } = await client
		.from('player_game_stats')
		.select('*')
		.order('game_date', { ascending: false });

	if (error) {
		console.error('Error loading game stats:', error);
		throw error;
	}

	return (data ?? []).map((stat: PlayerGameStats) => enrichStat(stat));
}

export async function getStatById(id: string): Promise<PlayerGameStatsWithDetails | null> {
	const client = requireSupabase();
	const { data, error } = await client
		.from('player_game_stats')
		.select('*')
		.eq('id', id)
		.maybeSingle();

	if (error) {
		console.error(`Error loading game stat ${id}:`, error);
		throw error;
	}

	return data ? enrichStat(data as PlayerGameStats) : null;
}

export async function getRecentStats(since: string): Promise<PlayerGameStatsWithDetails[]> {
	const client = requireSupabase();
	const { data, error } = await client
		.from('player_game_stats')
		.select('*')
		.gte('created_at', since)
		.order('created_at', { ascending: true });

	if (error) {
		console.error('Error loading recent game stats:', error);
		throw error;
	}

	return (data ?? []).map((stat: PlayerGameStats) => enrichStat(stat));
}

export async function getLatestStat(): Promise<PlayerGameStatsWithDetails | null> {
	const client = requireSupabase();
	const { data, error } = await client
		.from('player_game_stats')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(1);

	if (error) {
		console.error('Error loading latest game stat:', error);
		throw error;
	}

	const stat = data?.[0] as PlayerGameStats | undefined;
	return stat ? enrichStat(stat) : null;
}
