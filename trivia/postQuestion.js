const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { triviaChannelId } = require('../config.json');
const { insertAnswer, getQuestion, getChoices } = require('../db/triviaQueries.js');
const { triviaCategoryToColor } = require('../data/triviaCatgories.js');
const { shuffle } = require('../functions/shuffleArray');

async function postQuestion(client) {

	// Get question from the database
	const q = await getQuestion();
	// console.log(q);

	// Assign values for the Embed message (title, difficulty, category)
	const category = q.category;
	const color = triviaCategoryToColor(category);
	const question = q.question;
	const difficulty = q.difficulty;
	const embed = await createEmbed(color, category, difficulty, question);

	// Get the question ID, type, and answer
	const qId = q.id;
	const type = q.type;
	const ans = q.answer;

	// Build the button row
	let row;
	// Check if multiple choice or T/F
	if (type == 'multiple') {

		// Get options and put them inside an array
		const options = await getChoices(qId);
		const choices = [];
		for (let i = 0; i < options.length; i++) {
			choices.push(options[i].choice);
		}
		choices.push(ans);
		// console.log(choices);

		// Shuffle array
		shuffle(choices);
		// console.log(choices);
		row = await createMultRow(choices);
	}
	else if (type == 'boolean') {
		row = await createBooRow();
	}
	else {
		console.log('ERROR');
	}
	// Get channel ID for trivia channel (set in config)
	const channel = client.channels.cache.get(triviaChannelId);

	// console.log(embed);
	// console.log(channel);

	// Create the message to send
	const resp = await channel.send({
		embeds: [embed],
		components: [row],
	});

	// Create the collector to wait for button clicks (ms)
	const collector = resp.createMessageComponentCollector({ componentType: ComponentType.Button, time: 43200000 });
	const clickedUsers = [];
	const answers = [];

	collector.on('collect', async i => {
		// console.log(i);

		// Only allow each user to submit 1 answer, their first button click
		if (clickedUsers.includes(i.user.id)) {
			// console.log('true');
			await i.reply('You can no longer answer this question')
				.then(repliedMessage => {
					setTimeout(() => repliedMessage.delete(), 5000);
				})
				.catch();
		}
		else {
			const selection = i.customId;

			clickedUsers.push(i.user.id);
			answers.push(selection);

			await insertAnswer(i.user.id, selection);
			await i.reply(`${i.user} has entered their final answer.`)
				.then(repliedMessage => {
					setTimeout(() => repliedMessage.delete(), 5000);
				})
				.catch();
		}
	});

	collector.on('end', async collected => {
		const users = new Set();
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

// Create the embed style of message
async function createEmbed(color, category, difficulty, question) {
	return new EmbedBuilder()
		.setColor(color)
		.setTitle(category + ' (' + difficulty + ')')
		.setDescription(question);
}

// Create row of buttons for multiple choice questions
async function createMultRow(choices) {

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

	return new ActionRowBuilder()
		.addComponents(first, second, third, fourth);
}

// Create row of buttons for T/F questions
async function createBooRow() {

	const first = new ButtonBuilder()
		.setCustomId('True')
		.setLabel('True')
		.setStyle(ButtonStyle.Primary);

	const second = new ButtonBuilder()
		.setCustomId('False')
		.setLabel('False')
		.setStyle(ButtonStyle.Primary);

	return new ActionRowBuilder()
		.addComponents(first, second);
}

module.exports = { postQuestion };
