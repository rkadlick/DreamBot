import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

if (!clientId || !guildId || !token) {
	throw new Error('CLIENT_ID, GUILD_ID, and TOKEN environment variables are required');
}

const rest = new REST({ version: '10' }).setToken(token);

rest.get(Routes.applicationGuildCommands(clientId, guildId))
	.then(data => {
		const promises: Promise<unknown>[] = [];
		const commands = data as Array<{ id: string }>;
		for (const command of commands) {
			const deleteUrl = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`;
			promises.push(rest.delete(deleteUrl));
		}
		return Promise.all(promises);
	})
	.catch(console.error);

