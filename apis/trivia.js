const fetch = require('node-fetch-commonjs');

async function generateQuestion() {
	const api = 'https://opentdb.com/api.php?amount=1';
	const res = await fetch(api);
	const json = await res.json();
	return json;
}

module.exports = { generateQuestion };