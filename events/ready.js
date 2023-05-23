const { Events } = require('discord.js');
const { daily } = require('../scheduler/daily');
const { postQuestion } = require('../trivia/showQuestion');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		daily(client);
		postQuestion(client);
	},
};
