import {
	ActionRowBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
	type Client,
	type TextChannel,
	type MessageComponentInteraction,
} from 'discord.js';
import * as db from '../db/triviaQueries.js';
import { triviaCategoryToColor } from '../data/triviaCategories.js';
import { shuffle } from '../functions/shuffleArray.js';

const triviaChannelId = process.env.TRIVIA_CHANNEL_ID;

if (!triviaChannelId) {
	throw new Error('TRIVIA_CHANNEL_ID environment variable is required');
}

// Create the embed style of message
function createEmbed(color: string, category: string, difficulty: string, question: string): EmbedBuilder {
	return new EmbedBuilder()
		.setColor(color as `#${string}`)
		.setTitle(category + ' (' + difficulty + ')')
		.setDescription(question);
}

// Create row of buttons for multiple choice questions
function createMultRow(choices: string[]): ActionRowBuilder<ButtonBuilder> {
	const first = new ButtonBuilder()
		.setCustomId(choices[0])
		.setLabel(choices[0])
		.setStyle(ButtonStyle.Primary);

	const second = new ButtonBuilder()
		.setCustomId(choices[1])
		.setLabel(choices[1])
		.setStyle(ButtonStyle.Primary);

	const third = new ButtonBuilder()
		.setCustomId(choices[2])
		.setLabel(choices[2])
		.setStyle(ButtonStyle.Primary);

	const fourth = new ButtonBuilder()
		.setCustomId(choices[3])
		.setLabel(choices[3])
		.setStyle(ButtonStyle.Primary);

	return new ActionRowBuilder<ButtonBuilder>()
		.addComponents(first, second, third, fourth);
}

// Create row of buttons for T/F questions
function createBooRow(): ActionRowBuilder<ButtonBuilder> {
	const first = new ButtonBuilder()
		.setCustomId('True')
		.setLabel('True')
		.setStyle(ButtonStyle.Primary);

	const second = new ButtonBuilder()
		.setCustomId('False')
		.setLabel('False')
		.setStyle(ButtonStyle.Primary);

	return new ActionRowBuilder<ButtonBuilder>()
		.addComponents(first, second);
}

export async function postQuestion(client: Client): Promise<void> {
	// Get question from the database
	const q = db.getQuestion();

	// Assign values for the Embed message (title, difficulty, category)
	const category = q.category;
	const color = triviaCategoryToColor(category);
	const question = q.question;
	const difficulty = q.difficulty;
	const embed = createEmbed(color, category, difficulty, question);

	// Get the question ID, type, and answer
	const qId = q.id;
	const type = q.type;
	const ans = q.answer;

	// Build the button row
	let row: ActionRowBuilder<ButtonBuilder>;
	// Check if multiple choice or T/F
	if (type === 'multiple') {
		// Get options and put them inside an array
		const options = db.getChoices(qId);
		const choices: string[] = [];
		for (let i = 0; i < options.length; i++) {
			choices.push(options[i].choice);
		}
		choices.push(ans);

		// Shuffle array
		shuffle(choices);
		row = createMultRow(choices);
	} else if (type === 'boolean') {
		row = createBooRow();
	} else {
		console.log('ERROR');
		return;
	}

	// Get channel ID for trivia channel (set in config)
	const channel = client.channels.cache.get(triviaChannelId) as TextChannel | undefined;
	if (!channel) {
		console.log(`Trivia channel ${triviaChannelId} not found.`);
		return;
	}

	// Create the message to send
	const resp = await channel.send({
		embeds: [embed],
		components: [row],
	});

	// Create the collector to wait for button clicks (ms)
	const collector = resp.createMessageComponentCollector({ componentType: ComponentType.Button, time: 43200000 });
	const clickedUsers: string[] = [];
	const answers: string[] = [];

	collector.on('collect', async (i: MessageComponentInteraction) => {
		// Only allow each user to submit 1 answer, their first button click
		if (clickedUsers.includes(i.user.id)) {
			await i.reply('You can no longer answer this question')
				.then(repliedMessage => {
					setTimeout(() => repliedMessage.delete(), 5000);
				})
				.catch(() => {});
		} else {
			const selection = i.customId;

			clickedUsers.push(i.user.id);
			answers.push(selection);

			db.insertAnswer(i.user.id, selection);
			await i.reply(`${i.user} has entered their final answer.`)
				.then(repliedMessage => {
					setTimeout(() => repliedMessage.delete(), 5000);
				})
				.catch(() => {});
		}
	});

	collector.on('end', async collected => {
		const users = new Set<string>();
		console.log(collected);
		collected.forEach(async interaction => {
			const userId = interaction.user.id;
			if (!users.has(userId)) {
				users.add(userId);
				await channel.send(interaction.user.username + ' answered with ' + interaction.customId);
			}
		});
		await channel.send('The correct answer is: ' + ans);
	});
}

