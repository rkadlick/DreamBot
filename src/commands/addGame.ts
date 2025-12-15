import { SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch-commonjs';
import { getGameId } from '../functions/getGameId.js';
import { toPrice } from '../functions/price.js';
import * as db from '../db/gameQueries.js';
import { showGames } from '../games/showGames.js';
import type { Command } from '../types/index.js';
import type { SteamAppDetails } from '../types/index.js';

const gamesChannelId = process.env.GAMES_CHANNEL_ID;

if (!gamesChannelId) {
	throw new Error('GAMES_CHANNEL_ID environment variable is required');
}

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('add_game')
		.setDescription('Add a Game to the database')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('Game Name')
				.setRequired(true)),
	async execute(interaction) {
		if (interaction.channel?.id !== gamesChannelId) {
			await interaction.reply('Please use the games channel.');
			return;
		}
		await interaction.deferReply();
		const name = interaction.options.getString('input', true);
		const id = await getGameId(name);

		if (id === 'null') {
			await interaction.editReply(`${name} is not listed on steam. Please try again.`);
			return;
		}

		const api = `https://store.steampowered.com/api/appdetails?appids=${id}&cc=us&l=en`;
		const res = await fetch(api);
		const json = await res.json() as SteamAppDetails;

		let price: string;
		if (json[id].data.release_date.coming_soon) {
			price = 'Coming soon';
		} else if (json[id].data.price_overview === undefined) {
			price = toPrice(json[id].data.package_groups![0].subs[0].price_in_cents_with_discount);
		} else {
			price = toPrice(json[id].data.price_overview.final);
		}

		db.insertGame(parseInt(id), name.toLowerCase(), price);

		const msg = await interaction.editReply(`${name} added to the database.`);
		setTimeout(() => {
			msg.delete();
		}, 60000);
		await showGames(interaction.channel!);
	},
};

