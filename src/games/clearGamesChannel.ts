import type { Client, TextChannel } from 'discord.js';
import { showGames } from './showGames.js';

const gamesChannelId = process.env.GAMES_CHANNEL_ID;

if (!gamesChannelId) {
	throw new Error('GAMES_CHANNEL_ID environment variable is required');
}

export async function clearGamesChannel(client: Client): Promise<void> {
	const channel = client.channels.cache.get(gamesChannelId) as TextChannel | undefined;
	if (!channel) {
		console.log(`Channel ${gamesChannelId} not found.`);
		return;
	}

	const msgs = await channel.messages.fetch({ limit: 100 });

	if (msgs.size > 5) {
		await channel.bulkDelete(100, true)
			.then(messages => console.log(`Deleted ${messages.size} messages from ${channel.name}.`))
			.catch(console.error);
		await showGames(channel);
	}
}

