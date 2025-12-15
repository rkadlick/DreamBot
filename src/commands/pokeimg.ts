import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { request } from 'undici';
import { capitalizeFirstLetter } from '../functions/string.js';
import type { Command } from '../types/index.js';
import type { PokemonAPIResponse } from '../types/index.js';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('pokeimg')
		.setDescription('Get Image of the Mentioned Pokemon')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('Pokemon Name')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const name = interaction.options.getString('input', true);
		const res = await request(`https://pokeapi.co/api/v2/pokemon/${name}`);
		const json = await res.body.json() as PokemonAPIResponse;

		const height = String(json.height * 3.937008);
		const weight = String(json.weight * 0.2204623);
		const types = json.types;
		let type = '';
		for (let i = 0; i < types.length; i++) {
			type += capitalizeFirstLetter(types[i].type.name) + ' ';
		}

		const embed = new EmbedBuilder()
			.setColor(0xFF0000)
			.setTitle(capitalizeFirstLetter(json.name))
			.setURL(`https://bulbapedia.bulbagarden.net/wiki/${name}_(Pok%C3%A9mon)`)
			.setImage(json.sprites.front_default)
			.addFields(
				{ name: 'Type', value: type },
				{ name: 'Height (in)', value: height },
				{ name: 'Weight (lbs)', value: weight },
			);
		await interaction.editReply({ embeds: [embed] });
	},
};

