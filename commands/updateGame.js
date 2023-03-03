const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch-commonjs');
const { toPrice } = require('../functions/price.js');
const { updateGame, getGameId } = require('../db/gameQueries.js');
const { gamesChannelId } = require('../config.json');
const { showGames } = require('../games/showGames');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('update_game')
		.setDescription('Update game price in the database')
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
		const ans = await getGameId(name.toLowerCase());

		if (ans.length < 1) {
			const msg = await interaction.editReply(`${name} not in the database.`);
			setTimeout(() => {
				msg.delete();
			}, 60000);
			return;
		}

		const id = ans[0].game_id;
		// console.log('Id: ' + id);

		const api = `https://store.steampowered.com/api/appdetails?appids=${id}&cc=us&l=en`;
		// console.log('API: ' + api);
		const res = await fetch(api);
		const json = await res.json();

		// console.log('JSON: ' + json[id]);

		const init = json[id].data.price_overview.final;
		let price;
		if (init === undefined) {
			price = toPrice(json[id].data.package_groups[0].subs[0].price_in_cents_with_discount);
		}
		else {
			price = toPrice(json[id].data.price_overview.final);
		}
		updateGame(id, price);

		const msg = await interaction.editReply(`${name} updated.`);
		setTimeout(() => {
			msg.delete();
		}, 60000);
		showGames(interaction.channel);
	},
};