const { gamesChannelId } = require('../config.json');
const { showGames } = require('./showGames');

async function clearGamesChannel(client) {
	const channel = client.channels.cache.get(gamesChannelId);
	if (!channel) {
		console.log(`Channel ${gamesChannelId} not found.`);
		return;
	}

	const msgs = await channel.messages.fetch({ limit: 100 });

	if (msgs.size > 5) {
		await channel.bulkDelete(100)
			.then(messages => console.log(`Deleted ${messages.size} messages from ${channel.name}.`))
			.catch(console.error);
		showGames(channel);
	}

}

module.exports = { clearGamesChannel };