import { SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch-commonjs';
import { toPrice } from '../functions/price.js';
import { updateGame, getGameById } from '../db/gameQueries.js';
import { showGames } from '../games/showGames.js';
import type { Command } from '../types/index.js';
import type { SteamAppDetails } from '../types/index.js';

const gamesChannelId = process.env.GAMES_CHANNEL_ID;

if (!gamesChannelId) {
	throw new Error('GAMES_CHANNEL_ID environment variable is required');
}

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('update_game')
		.setDescription('Update game price in the database')
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
		const id = getGameById(name.toLowerCase());

		if (id === null) {
			const msg = await interaction.editReply(`${name} not in the database.`);
			setTimeout(() => {
				msg.delete();
			}, 60000);
			return;
		}

		const api = `https://store.steampowered.com/api/appdetails?appids=${id}&cc=us&l=en`;
		const res = await fetch(api);
		const json = await res.json() as SteamAppDetails;

		const appData = json[id.toString()];
		if (!appData || !appData.success) {
			await interaction.editReply(`Failed to fetch game data for ${name}.`);
			return;
		}

		const init = appData.data.price_overview?.final;
		let price: string;
		if (init === undefined) {
			price = toPrice(appData.data.package_groups![0].subs[0].price_in_cents_with_discount);
		} else {
			price = toPrice(init);
		}
		updateGame(id, price);

		const msg = await interaction.editReply(`${name} updated.`);
		setTimeout(() => {
			msg.delete();
		}, 60000);
		await showGames(interaction.channel!);
	},
};

