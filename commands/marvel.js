const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');
const getDate = require('../functions/date.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('marvel')
		.setDescription('What is the next Marvel movie?'),
	async execute(interaction) {
		await interaction.deferReply();
		const date = getDate.printDate();
		const res = await request(`https://www.whenisthenextmcufilm.com/api?date=${date}`);
		const json = await res.body.json();

		const embed = new EmbedBuilder()
			.setColor(0xFF0000)
			.setTitle(json.title)
			.setImage(json.poster_url)
			.addFields(
				{ name: 'Days Until', value: String(json.days_until) },
				{ name: 'Release Date', value: String(json.release_date) },
				{ name: 'Overview', value: json.overview },
			);
		interaction.editReply({ embeds: [embed] });

		await interaction.editReply({ embeds: [embed] });
	},
};