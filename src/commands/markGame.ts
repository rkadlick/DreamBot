import { SlashCommandBuilder } from 'discord.js';
import * as db from '../db/gameQueries.js';
import { showGames } from '../games/showGames.js';
import type { Command } from '../types/index.js';

const gamesChannelId = process.env.GAMES_CHANNEL_ID;
const seanPaul = process.env.SEAN_PAUL;
const luap = process.env.LUAP;
const popSmoke = process.env.POP_SMOKE;

if (!gamesChannelId) {
	throw new Error('GAMES_CHANNEL_ID environment variable is required');
}

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('mark')
		.setDescription('Mark ownership of game')
		.addStringOption(option =>
			option.setName('game')
				.setDescription('Game Name')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('mark')
				.setDescription('true or false')
				.setRequired(true)),
	async execute(interaction) {
		if (interaction.channel?.id !== gamesChannelId) {
			await interaction.reply('Please use the games channel.');
			return;
		}
		await interaction.deferReply();
		const name = interaction.options.getString('game', true);
		const id = db.getGameById(name);
		const boo = interaction.options.getBoolean('mark', true);

		if (id === null) {
			await interaction.editReply(`${name} is not in the database. Please try again.`);
			return;
		}

		let user: string;

		if (interaction.user.id === seanPaul) {
			user = 'sp';
		} else if (interaction.user.id === luap) {
			user = 'lp';
		} else if (interaction.user.id === popSmoke) {
			user = 'ps';
		} else {
			const msg = await interaction.editReply('The user who wrote this does not exist.');
			setTimeout(() => {
				msg.delete();
			}, 60000);
			await showGames(interaction.channel!);
			return;
		}
		db.markGame(id, boo, user);

		const msg = await interaction.editReply(`${name} marked as ${boo}`);
		setTimeout(() => {
			msg.delete();
		}, 60000);
		await showGames(interaction.channel!);
	},
};

