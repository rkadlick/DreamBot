const { SlashCommandBuilder } = require('discord.js');
const { request } = require('undici');
const gameToID = require('../functions/gameToID.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_game')
		.setDescription('Add a Game to the database')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('Game Name')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const name = interaction.options.getString('input');
		const id = gameToID(name);

		const res = await request(`https://store.steampowered.com/api/appdetails?appids=${id}`);
		const json = await res.body.json();

		const price = json.data.price_overview.final;

		await interaction.editReply(`${name} has the id ${id} and costs ${price}`);
	},
};