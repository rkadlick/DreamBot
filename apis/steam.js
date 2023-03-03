const fetch = require('node-fetch-commonjs');
let steamResults;

async function generateSteamApi() {
	const api = 'https://api.steampowered.com/ISteamApps/GetAppList/v0002/';
	const res = await fetch(api);
	const json = await res.json();
	steamResults = json;
	// console.log('JSON: ' + json);
}

async function getGames() {
	if (steamResults == null) {
		console.log('ERROR: RESULTS ARE NULL');
		await generateSteamApi();
	}
	// console.log('Results: ' + steamResults);
	return steamResults;
}

module.exports = { getGames };