import { Events } from 'discord.js';
import { daily } from '../scheduler/daily.js';
// import { postQuestion } from '../trivia/postQuestion.js';
import type { Event, ExtendedClient } from '../types/index.js';

export const event: Event = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${(client as ExtendedClient).user?.tag}`);
		daily(client as ExtendedClient);
		// postQuestion(client);
	},
};

