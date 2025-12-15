import { SlashCommandBuilder } from 'discord.js';
import patrick from '../data/patrick.json' assert { type: 'json' };
import type { Command } from '../types/index.js';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('patrick')
		.setDescription('Replies a gif of Patrick Start!'),
	async execute(interaction) {
		const patrickArray = patrick as string[];
		await interaction.reply(`${patrickArray[Math.floor(Math.random() * patrickArray.length)]}`);
	},
};

