import fetch from 'node-fetch-commonjs';
import type { TriviaAPIResponse } from '../types/index.js';

export async function generateQuestion(): Promise<TriviaAPIResponse> {
	const api = 'https://opentdb.com/api.php?amount=1';
	const res = await fetch(api);
	const json = await res.json() as TriviaAPIResponse;
	return json;
}

