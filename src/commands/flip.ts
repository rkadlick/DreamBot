import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../types/index.js';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('flip')
		.setDescription('Flips a coin'),
	async execute(interaction) {
		await interaction.deferReply();
		const random = Math.floor(Math.random() * Math.floor(2));
		if (random === 0) {
			await interaction.editReply('Heads!');
		} else {
			await interaction.editReply('Tails!');
		}
	},
};

