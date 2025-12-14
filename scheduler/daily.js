const cron = require('node-cron');
const { clearGamesChannel } = require('../games/clearGamesChannel.js');
const { addQuestion } = require('../trivia/addQuestion.js');
const { postQuestion } = require('../trivia/postQuestion.js');

function daily(client) {
	// 5am 
	cron.schedule('00 05 * * *', () => {
		clearGamesChannel(client);
	});
	// 10:50am
	cron.schedule('50 10 * * *', () => {
		addQuestion();
	});
	// 11am
	cron.schedule('00 11 * * *', () => {
		postQuestion(client);
	});
}

module.exports = { daily };