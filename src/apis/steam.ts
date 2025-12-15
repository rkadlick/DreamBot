import fetch from 'node-fetch-commonjs';
import type { SteamAppList } from '../types/index.js';

let steamResults: SteamAppList | null = null;

export async function generateSteamApi(): Promise<void> {
	const api = 'https://api.steampowered.com/ISteamApps/GetAppList/v0002/';
	const res = await fetch(api);
	const json = await res.json() as SteamAppList;
	steamResults = json;
}

export async function getGames(): Promise<SteamAppList> {
	if (steamResults == null) {
		console.log('ERROR: RESULTS ARE NULL');
		await generateSteamApi();
	}
	if (!steamResults) {
		throw new Error('Failed to fetch Steam API results');
	}
	return steamResults;
}

