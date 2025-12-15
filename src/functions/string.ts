export function capitalizeFirstLetter(string: string): string {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function toUpper(str: string): string {
	return str
		.toLowerCase()
		.split(' ')
		.map(function(word) {
			return word[0].toUpperCase() + word.substr(1);
		})
		.join(' ');
}

