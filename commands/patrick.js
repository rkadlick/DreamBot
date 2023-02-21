const patrick = require('../data/patrick.json');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('patrick')
		.setDescription('Replies a gif of Patrick Start!'),
	async execute(interaction) {
		await interaction.reply(`${patrick[Math.floor(Math.random() * patrick.length)]}`);
	},
};