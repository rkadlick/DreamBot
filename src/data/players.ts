import type { Client } from 'discord.js';

const PLAYER_ENV_KEYS: Record<string, 'SEAN_PAUL' | 'POP_SMOKE'> = {
	'player-1': 'SEAN_PAUL',
	'player-1-2k26': 'SEAN_PAUL',
	'player-2': 'POP_SMOKE',
	'player-2-2k26': 'POP_SMOKE',
};

function getDiscordUserIdForPlayer(playerId: string): string | undefined {
	const envKey = PLAYER_ENV_KEYS[playerId];
	if (!envKey) {
		return undefined;
	}
	return process.env[envKey];
}

export async function resolvePlayerLabel(client: Client, playerId: string): Promise<string> {
	const discordUserId = getDiscordUserIdForPlayer(playerId);
	if (!discordUserId) {
		return playerId;
	}

	// Ensures the user is cached so the mention renders with their current name.
	await client.users.fetch(discordUserId).catch(() => null);

	return `<@${discordUserId}>`;
}
