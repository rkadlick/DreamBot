const { SlashCommandBuilder } = require('discord.js');
const db = require('../db/gameQueries.js');
const { gamesChannelId, seanPaul, luap, popSmoke } = require('../config.json');
const { showGames } = require('../games/showGames');

module.exports = {
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
		if (interaction.channel.id != gamesChannelId) {
			await interaction.reply('Please use the games channel.');
			return;
		}
		await interaction.deferReply();
		const name = interaction.options.getString('game');
		const id = await db.getGameById(name);
		const boo = interaction.options.getBoolean('mark');

		// console.log('Id: ' + id);
		if (id === 'null') {
			await interaction.editReply(`${name} is not in the database. Please try again.`);
			return;
		}

		let user;

		if (interaction.user.id === seanPaul) {
			user = 'sp';
		}
		else if (interaction.user.id === luap) {
			user = 'lp';
		}
		else if (interaction.user.id === popSmoke) {
			user = 'ps';
		}
		else {
			const msg = await interaction.editReply('The user who wrote this does not exist.');
			setTimeout(() => {
				msg.delete();
			}, 60000);
			showGames(interaction.channel);
			return;
		}
		db.markGame(id, boo, user);

		const msg = await interaction.editReply(`${name} marked as ${boo}`);
		setTimeout(() => {
			msg.delete();
		}, 60000);
		showGames(interaction.channel);
	},
};