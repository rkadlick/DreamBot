const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('flip')
		.setDescription('Flips a coin'),
	async execute(interaction) {
		await interaction.deferReply();
		const random = (Math.floor(Math.random() * Math.floor(2)));
		if (random === 0) {
			await interaction.editReply('Heads!');
		}
		else {
			await interaction.editReply('Tails!');
		}
	},
};
