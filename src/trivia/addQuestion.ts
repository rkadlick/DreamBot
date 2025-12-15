import { generateQuestion } from '../apis/trivia.js';
import * as db from '../db/triviaQueries.js';

async function insertChoices(choices: string[]): Promise<void> {
	for (let i = 0; i < choices.length; i++) {
		db.insertChoice(choices[i]);
	}
}

export async function addQuestion(): Promise<void> {
	// Generate the question and see if it already exists in the DB
	let json = await generateQuestion();
	let question = json.results[0].question;
	let check = db.checkQuestion(question);

	// If check is equal to 1 that means there is a record in the DB containing that question already
	// The loop will regenerate a new question to avoid duplicates
	while (check >= 1) {
		json = await generateQuestion();
		question = json.results[0].question;
		check = db.checkQuestion(question);
	}

	const category = json.results[0].category;
	const type = json.results[0].type;
	const diff = json.results[0].difficulty;
	const answer = json.results[0].correct_answer;
	const choices = json.results[0].incorrect_answers;

	// Insert the question and the choices if the question has any
	db.insertQuestion(category, type, diff, question, answer);

	if (type === 'multiple') {
		await insertChoices(choices);
	}
}

