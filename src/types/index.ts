import { SlashCommandBuilder, ChatInputCommandInteraction, Client, Collection, Events } from 'discord.js';
import Database from 'better-sqlite3';

// Command type definition
export interface Command {
	data: SlashCommandBuilder;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

// Event type definition
export interface Event {
	name: Events;
	once?: boolean;
	execute: (...args: any[]) => void | Promise<void>;
}

// Extended Client with commands collection
export interface ExtendedClient extends Client {
	commands: Collection<string, Command>;
}

// Database types
export interface Game {
	id?: number;
	game_id: number;
	name: string;
	price: string;
	kadlick: boolean | number;
	paul: boolean | number;
	tj: boolean | number;
}

export interface TriviaQuestion {
	id: number;
	category: string;
	difficulty: string;
	type: string;
	question: string;
	answer: string;
}

export interface QuestionChoice {
	id: number;
	question_id: number;
	choice: string;
}

export interface TriviaStatistics {
	id: number;
	user_id: string;
	question_id: number;
	answer: string;
	correct: boolean | number;
	date: string;
}

// Steam API types
export interface SteamApp {
	appid: number;
	name: string;
}

export interface SteamAppList {
	applist: {
		apps: SteamApp[];
	};
}

export interface SteamAppDetails {
	[id: string]: {
		success: boolean;
		data: {
			name: string;
			release_date: {
				coming_soon: boolean;
			};
			price_overview?: {
				final: number;
			};
			package_groups?: Array<{
				subs: Array<{
					price_in_cents_with_discount: number;
				}>;
			}>;
		};
	};
}

// Trivia API types
export interface TriviaResult {
	category: string;
	type: 'multiple' | 'boolean';
	difficulty: 'easy' | 'medium' | 'hard';
	question: string;
	correct_answer: string;
	incorrect_answers: string[];
}

export interface TriviaAPIResponse {
	response_code: number;
	results: TriviaResult[];
}

// Marvel API types
export interface MarvelAPIResponse {
	title: string;
	poster_url: string;
	days_until: number;
	release_date: string;
	overview: string;
}

// Pokemon API types
export interface PokemonType {
	type: {
		name: string;
	};
}

export interface PokemonAPIResponse {
	name: string;
	height: number;
	weight: number;
	types: PokemonType[];
	sprites: {
		front_default: string;
	};
}

// Database instance type
export type DatabaseInstance = Database.Database;

