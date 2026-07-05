import type { ButtonInteraction } from 'discord.js';
import { getStatById } from '../apis/nba.js';
import { resolvePlayerLabel } from '../data/players.js';
import { buildStatlinePayload, parseNbaStatsButtonId } from './formatStatline.js';

export async function handleNbaStatsToggle(interaction: ButtonInteraction): Promise<void> {
	const parsed = parseNbaStatsButtonId(interaction.customId);
	if (!parsed) {
		return;
	}

	const expanded = parsed.action === 'expand';

	try {
		const stat = await getStatById(parsed.statId);
		if (!stat) {
			await interaction.reply({ content: 'Could not load game stats.', ephemeral: true });
			return;
		}

		const playerLabel = await resolvePlayerLabel(interaction.client, stat.player_id);
		const payload = buildStatlinePayload(stat, playerLabel, expanded);

		await interaction.update(payload);
	} catch (error) {
		console.error('Failed to toggle NBA statline:', error);
		if (!interaction.replied && !interaction.deferred) {
			await interaction.reply({ content: 'Failed to update stats.', ephemeral: true });
		}
	}
}
