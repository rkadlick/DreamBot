export function printDate(): string {
	const temp = new Date();
	const pad = (i: number): string => (i < 10) ? '0' + i : '' + i;

	return temp.getFullYear() + '-' +
		pad(1 + temp.getMonth()) + '-' +
		pad(temp.getDate());
}

