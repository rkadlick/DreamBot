const { SlashCommandBuilder } = require('discord.js');
const db = require('../db/gameQueries.js');
const { gamesChannelId } = require('../config.json');
const { showGames } = require('../games/showGames');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove_game')
		.setDescription('Remove a game from the database')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('Game Name')
				.setRequired(true)),
	async execute(interaction) {
		if (interaction.channel.id != gamesChannelId) {
			await interaction.reply('Please use the games channel.');
			return;
		}
		await interaction.deferReply();
		const name = interaction.options.getString('input');
		const id = await db.getGameById(name);

		// console.log('Id: ' + id);
		if (id === 'null') {
			await interaction.editReply(`${name} is not in the database. Please try again.`);
			return;
		}

		db.removeGameById(id);

		const msg = await interaction.editReply(`${name} removed from the database.`);
		setTimeout(() => {
			msg.delete();
		}, 60000);
		showGames(interaction.channel);
	},
};