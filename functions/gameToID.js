const { request } = require('undici');
const getResults = require('../apis/steam.js')

module.exports = test => {
	const type = test.constructor.name;
	switch (type) {
	case 'String':
		return name_exact(test);
	/* case 'Number':
		return byId(test);
	case 'RegExp':
		return name_regex(test); */
	default:
		throw new Error('Please supply either a String, a Number, or a Regular Expression, ' + type + ' is not supported');
	}
};

/* function byId(id) {
	return new Promise((resolve, reject) => {
		request(options).then(data => {
			data = JSON.parse(data);
			resolve(data.applist.apps.filter(a => a.appid === id)[0]);
		}).catch(e => reject(e));
	});
} */

function name_exact(name) {

	return data.applist.apps.filter(a => a.name === name)[0];

	/* return new Promise((resolve, reject) => {
		request(options).then(data => {
			data = JSON.parse(data);
			resolve(data.applist.apps.filter(a => a.name === name)[0]);
		}).catch(e => reject(e));
	}); */
}

/* function name_regex(re) {
	return new Promise((resolve, reject) => {
		request(options).then(data => {
			data = JSON.parse(data);
			resolve(data.applist.apps.filter(a => a.name.match(re)));
		}).catch(e => reject(e));
	}); 
} */
