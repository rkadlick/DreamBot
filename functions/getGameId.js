const { getGames } = require('../apis/steam.js');


async function getGameId(name) {

	const data = await getGames();

	// console.log(data);
	console.log(name);
	const game = data.applist.apps.find(a => a.name.toLowerCase() === name.toLowerCase());
	console.log(game);
	return game ? game.appid : 'null';
}

module.exports = { getGameId };
