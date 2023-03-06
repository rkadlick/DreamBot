const cron = require('node-cron');
const { clearGamesChannel } = require('../games/clearGamesChannel.js');

function daily(client) {
	cron.schedule('00 05 * * *', () => {
		clearGamesChannel(client);
	});
}

module.exports = { daily };