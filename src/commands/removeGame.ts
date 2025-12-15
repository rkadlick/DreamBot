import { SlashCommandBuilder } from 'discord.js';
import * as db from '../db/gameQueries.js';
import { showGames } from '../games/showGames.js';
import type { Command } from '../types/index.js';

const gamesChannelId = process.env.GAMES_CHANNEL_ID;

if (!gamesChannelId) {
	throw new Error('GAMES_CHANNEL_ID environment variable is required');
}

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('remove_game')
		.setDescription('Remove a game from the database')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('Game Name')
				.setRequired(true)),
	async execute(interaction) {
		if (interaction.channel?.id !== gamesChannelId) {
			await interaction.reply('Please use the games channel.');
			return;
		}
		await interaction.deferReply();
		const name = interaction.options.getString('input', true);
		const id = db.getGameById(name);

		if (id === null) {
			await interaction.editReply(`${name} is not in the database. Please try again.`);
			return;
		}

		db.removeGameById(id);

		const msg = await interaction.editReply(`${name} removed from the database.`);
		setTimeout(() => {
			msg.delete();
		}, 60000);
		await showGames(interaction.channel!);
	},
};

