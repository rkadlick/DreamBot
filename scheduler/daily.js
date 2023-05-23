const cron = require('node-cron');
const { clearGamesChannel } = require('../games/clearGamesChannel.js');
const { addQuestion } = require('../trivia/addQuestion.js');
const { postQuestion } = require('../trivia/showQuestion.js');

function daily(client) {
	cron.schedule('00 05 * * *', () => {
		clearGamesChannel(client);
	});
	cron.schedule('50 10 * * *', () => {
		addQuestion();
	});
	cron.schedule('00 11 * * *', () => {
		postQuestion(client);
	});
}

module.exports = { daily };