const { Events } = require('discord.js');
const { daily } = require('../scheduler/daily');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		daily(client);
	},
};
