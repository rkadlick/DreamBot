import type { Client, TextChannel } from 'discord.js';
import { resolvePlayerLabel } from '../data/players.js';
import { buildStatlinePayload } from './formatStatline.js';
import type { PlayerGameStatsWithDetails } from '../types/index.js';

const nbaChannelId = process.env.NBA_CHANNEL_ID;

export async function postGameStats(
	client: Client,
	stat: PlayerGameStatsWithDetails,
): Promise<boolean> {
	if (!nbaChannelId) {
		console.warn('NBA_CHANNEL_ID is not set; skipping NBA stat post.');
		return false;
	}

	const channel = client.channels.cache.get(nbaChannelId) as TextChannel | undefined;
	if (!channel) {
		console.warn(`NBA channel ${nbaChannelId} not found.`);
		return false;
	}

	try {
		const playerLabel = await resolvePlayerLabel(client, stat.player_id);
		const payload = buildStatlinePayload(stat, playerLabel, false);
		await channel.send(payload);
		return true;
	} catch (error) {
		console.error(`Failed to post NBA statline for ${stat.id}:`, error);
		return false;
	}
}
