import { getGames } from '../db/gameQueries.js';
import { AsciiTable3 } from 'ascii-table3';
import { toUpper } from '../functions/string.js';
import type { TextChannel } from 'discord.js';

export async function showGames(channel: TextChannel): Promise<void> {
	const rows = getGames();

	const colNames = ['Name', 'Price', 'kadlick', 'paul', 'tj'];
	const outermatrix: string[][] = [];

	for (const row of rows) {
		const arr: string[] = [];
		for (const colName of colNames) {
			if (colName.toLowerCase() === 'game_id') {
				break;
			}
			const val = row[colName.toLowerCase() as keyof typeof row];
			const str = String(val);
			if (str === '0') {
				arr.push('false');
			} else if (str === '1') {
				arr.push('true');
			} else {
				arr.push(toUpper(str));
			}
		}
		outermatrix.push(arr);
	}

	const table =
		new AsciiTable3('Games')
			.setHeading('Name', 'Price', 'Kadlick', 'Paul', 'Tj')
			.setAlignCenter(1)
			.setAlignCenter(2)
			.setAlignCenter(3)
			.setAlignCenter(4)
			.setAlignCenter(5)
			.addRowMatrix(outermatrix);

	// set compact style
	table.setHeadingAlignCenter();
	table.setStyle('compact');
	const ans = table.toString();

	// Send the message to Discord
	await channel.send(` \`\`\`${ans}\`\`\` `);
}

