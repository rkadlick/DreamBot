import { getGames } from '../apis/steam.js';

export async function getGameId(name: string): Promise<string> {
	const data = await getGames();

	console.log(name);
	const game = data.applist.apps.find(a => a.name.toLowerCase() === name.toLowerCase());
	console.log(game);
	return game ? game.appid.toString() : 'null';
}

