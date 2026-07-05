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


export interface PlayerGameStats {
	id: string;
	player_id: string;
	season_id: string;
	game_date: string; // Date played (in-game date)
	opponent_team_id?: string;
	opponent_team_logo?: string;
	opponent_team_name?: string;
	is_home: boolean;
	is_win: boolean;
	player_score: number;
	opponent_score: number;
	is_cup_game?: boolean;
	is_simulated?: boolean;
	is_overtime?: boolean;
	is_key_game?: boolean;
	is_playoff_game?: boolean;
	playoff_series_id?: string;
	playoff_game_number?: number; // e.g., Game 3 of second round
	// Stats
	minutes?: number;
	points?: number;
	rebounds?: number;
	offensive_rebounds?: number;
	assists?: number;
	steals?: number;
	blocks?: number;
	turnovers?: number;
	fouls?: number;
	plus_minus?: number;
	fg_made?: number;
	fg_attempted?: number;
	threes_made?: number;
	threes_attempted?: number;
	ft_made?: number;
	ft_attempted?: number;
	created_at?: string;
	updated_at?: string;
	headline?: string | null;
  }

  export interface TeamColors {
	primary: string;
	secondary: string;
	onPrimary: string; // text color that passes accessibility contrast on the primary background
  }

  export interface Team {
	id: string; // e.g., "team-atl"
	fullName: string; // e.g., "Atlanta Hawks"
	abbreviation: string; // e.g., "ATL"
	conference: 'East' | 'West';
	colors: TeamColors;
	numericId: string; // NBA API ID for logos
  }

  export interface PlayerGameStatsWithDetails extends PlayerGameStats {
	opponent_team?: Team;
  }
