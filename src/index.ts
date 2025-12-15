import { Client, Collection, GatewayIntentBits, Events } from 'discord.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import dotenv from 'dotenv';
import type { Command, Event, ExtendedClient } from './types/index.js';

dotenv.config();

const token: string | undefined = process.env.TOKEN;
if (!token) {
	throw new Error('TOKEN environment variable is required but was not found. Please set it in .env.');
}

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
}) as ExtendedClient;

client.commands = new Collection<string, Command>();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load commands
const commandsPath = path.resolve(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const fileUrl = pathToFileURL(filePath).href;
	const { command } = await import(fileUrl);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Load events
const eventsPath = path.resolve(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const fileUrl = pathToFileURL(filePath).href;
	const { event } = await import(fileUrl);
	if (event.once) {
		client.once(event.name, (...args: unknown[]) => event.execute(...args));
	} else {
		client.on(event.name, (...args: unknown[]) => event.execute(...args));
	}
}

client.login(token);

export default client;
