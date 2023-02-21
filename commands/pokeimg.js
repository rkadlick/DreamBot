const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');
const stringFunc = require('../functions/string.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pokeimg')
		.setDescription('Get Image of the Mentioned Pokemon')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('Pokemon Name')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const name = interaction.options.getString('input');
		const res = await request(`https://pokeapi.co/api/v2/pokemon/${name}`);
		const json = await res.body.json();
		// console.log(json);
		/* if (!list) {
			return interaction.editReply(`No results found for **${name}**.`);
		}*/

		const height = String(json.height * 3.937008);
		const weight = String(json.weight * 0.2204623);
		const types = json.types;
		// eslint-disable-next-line no-var
		var type = '';
		for (let i = 0; i < types.length; i++) {
			type += stringFunc.capitalizeFirstLetter(types[i].type.name) + ' ';
		}

		const embed = new EmbedBuilder()
			.setColor(0xFF0000)
			.setTitle(stringFunc.capitalizeFirstLetter(json.name))
			.setURL(`https://bulbapedia.bulbagarden.net/wiki/${name}_(Pok%C3%A9mon)`)
			.setImage(json.sprites.front_default)
			.addFields(
				{ name: 'Type', value: type },
				{ name: 'Height (in)', value: height },
				{ name: 'Weight (lbs)', value: weight },
			);
		interaction.editReply({ embeds: [embed] });

		await interaction.editReply({ embeds: [embed] });
	},
};
