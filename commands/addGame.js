const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch-commonjs');
const { getGameId } = require('../functions/getGameId.js');
const { toPrice } = require('../functions/price.js');
const db = require('../db/gameQueries.js');
const { gamesChannelId } = require('../config.json');
const { showGames } = require('../games/showGames');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_game')
		.setDescription('Add a Game to the database')
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
		const id = await getGameId(name);

		// console.log('Id: ' + id);
		if (id === 'null') {
			await interaction.editReply(`${name} is not listed on steam. Please try again.`);
			return;
		}

		const api = `https://store.steampowered.com/api/appdetails?appids=${id}&cc=us&l=en`;
		// console.log('API: ' + api);
		const res = await fetch(api);
		const json = await res.json();

		// console.log('JSON: ' + json[id]);

		let price;
		if (json[id].data.release_date.coming_soon) {
			price = 'Coming soon';
		}
		else if (json[id].data.price_overview === undefined) {
			price = toPrice(json[id].data.package_groups[0].subs[0].price_in_cents_with_discount);
		}
		else {
			price = toPrice(json[id].data.price_overview.final);
		}


		db.insertGame(id, name.toLowerCase(), price);

		const msg = await interaction.editReply(`${name} added to the database.`);
		setTimeout(() => {
			msg.delete();
		}, 60000);
		showGames(interaction.channel);
	},
};