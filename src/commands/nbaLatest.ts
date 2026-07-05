import { SlashCommandBuilder } from 'discord.js';
import { getLatestStat } from '../apis/nba.js';
import { isSupabaseConfigured } from '../supabase/index.js';
import { postGameStats } from '../nba/postGameStats.js';
import type { Command } from '../types/index.js';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('nba_latest')
		.setDescription('[Dev] Post the most recent game statline from Supabase'),
	async execute(interaction) {
		if (!isSupabaseConfigured) {
			await interaction.reply({
				content: 'Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env.',
				ephemeral: true,
			});
			return;
		}

		await interaction.deferReply({ ephemeral: true });

		try {
			const stat = await getLatestStat();

			if (!stat) {
				await interaction.editReply('No game stats found in Supabase.');
				return;
			}

			const posted = await postGameStats(interaction.client, stat);

			if (!posted) {
				await interaction.editReply('Failed to post statline. Check NBA_CHANNEL_ID and bot channel access.');
				return;
			}

			await interaction.editReply(
				`Posted latest game (\`${stat.id}\`) to the NBA channel.`,
			);
		} catch (error) {
			console.error('nba_latest command failed:', error);
			await interaction.editReply('Failed to fetch or post the latest game stat.');
		}
	},
};
