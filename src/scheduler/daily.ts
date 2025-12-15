import type { Client } from 'discord.js';
// import cron from 'node-cron';
// import { clearGamesChannel } from '../games/clearGamesChannel.js';
// import { addQuestion } from '../trivia/addQuestion.js';
// import { postQuestion } from '../trivia/postQuestion.js';

export function daily(client: Client): void {
	// 5am
	// cron.schedule('00 05 * * *', () => {
	// 	clearGamesChannel(client);
	// });
	// Trivia scheduling guarded by TRIVIA_ENABLED
	// if (process.env.TRIVIA_ENABLED === 'true') {
	// 	// 10:50am
	// 	cron.schedule('50 10 * * *', () => {
	// 		addQuestion();
	// 	});
	// 	// 11am
	// 	cron.schedule('00 11 * * *', () => {
	// 		postQuestion(client);
	// 	});
	// }
}

