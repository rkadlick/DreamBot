import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { request } from 'undici';
import { printDate } from '../functions/date.js';
import type { Command } from '../types/index.js';
import type { MarvelAPIResponse } from '../types/index.js';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('marvel')
		.setDescription('What is the next Marvel movie?'),
	async execute(interaction) {
		await interaction.deferReply();
		const date = printDate();
		const res = await request(`https://www.whenisthenextmcufilm.com/api?date=${date}`);
		const json = await res.body.json() as MarvelAPIResponse;

		const embed = new EmbedBuilder()
			.setColor(0xFF0000)
			.setTitle(json.title)
			.setImage(json.poster_url)
			.addFields(
				{ name: 'Days Until', value: String(json.days_until) },
				{ name: 'Release Date', value: String(json.release_date) },
				{ name: 'Overview', value: json.overview },
			);
		await interaction.editReply({ embeds: [embed] });
	},
};

