function printDate() {
	const temp = new Date();
	const pad = (i) => (i < 10) ? '0' + i : '' + i;

	return temp.getFullYear() + '-' +
		pad(1 + temp.getMonth()) + '-' +
		pad(temp.getDate());
}

module.exports = { printDate };