const { generateQuestion } = require('../apis/trivia.js');
const db = require('../db/triviaQueries.js');

async function addQuestion() {

	// Generate the question and see if it already exists in the DB
	let json = await generateQuestion();
	let question = json.results[0].question;
	let check = await db.checkQuestion(question);

	// If check is equal to 1 that means there is a record in the DB containing that question already
	// The loop will regnerate a new question to avoid duplicates
	while (check == 1) {
		json = await generateQuestion();
		question = json.results[0].question;
		check = await db.checkQuestion(question);
	}

	const category = json.results[0].category;
	const type = json.results[0].type;
	const diff = json.results[0].difficulty;
	const answer = json.results[0].correct_answer;
	const choices = json.results[0].incorrect_answers;

	// console.log(json);
	// console.log(category);
	// console.log(type);
	// console.log(diff);
	// console.log(question);
	// console.log(answer);
	// console.log(choices);

	// Insert the question and the choices if the question has any
	await db.insertQuestion(category, type, diff, question, answer);

	if (type == 'multiple') {
		await insertChoices(choices);
	}

}

async function insertChoices(choices) {
	// console.log('choice');
	for (let i = 0; i < choices.length; i++) {
		await db.insertChoice(choices[i]);
	}
}

module.exports = { addQuestion };