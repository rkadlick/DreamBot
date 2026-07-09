import type { Client, TextChannel } from 'discord.js';
import { resolvePlayerLabel } from '../data/players.js';
import { buildStatlinePayload } from './formatStatline.js';
import type { PlayerGameStatsWithDetails } from '../types/index.js';

const nbaChannelId = process.env.NBA_CHANNEL_ID;

export async function postGameStats(
	client: Client,
	stat: PlayerGameStatsWithDetails,
): Promise<string | null> {
	if (!nbaChannelId) {
		console.warn('NBA_CHANNEL_ID is not set; skipping NBA stat post.');
		return null;
	}

	const channel = client.channels.cache.get(nbaChannelId) as TextChannel | undefined;
	if (!channel) {
		console.warn(`NBA channel ${nbaChannelId} not found.`);
		return null;
	}

	try {
		const playerLabel = await resolvePlayerLabel(client, stat.player_id);
		const payload = buildStatlinePayload(stat, playerLabel, false);
		const message = await channel.send(payload);
		return message.id;
	} catch (error) {
		console.error(`Failed to post NBA statline for ${stat.id}:`, error);
		return null;
	}
}

export async function updateGameStatsMessage(
	client: Client,
	stat: PlayerGameStatsWithDetails,
	messageId: string,
	channelId: string,
	expanded = false,
): Promise<boolean> {
	const channel = client.channels.cache.get(channelId) as TextChannel | undefined;
	if (!channel) {
		console.warn(`NBA channel ${channelId} not found for stat update.`);
		return false;
	}

	try {
		const message = await channel.messages.fetch(messageId);
		const playerLabel = await resolvePlayerLabel(client, stat.player_id);
		const payload = buildStatlinePayload(stat, playerLabel, expanded);
		await message.edit(payload);
		return true;
	} catch (error) {
		console.error(`Failed to update NBA statline message for ${stat.id}:`, error);
		return false;
	}
}
