module.exports = {
	randomImage,
};


const images = [
	'https://tenor.com/view/patrick-star-gif-26051005',
	'https://tenor.com/view/patrick-star-cute-cartoon-gif-13803124',
	'https://tenor.com/view/patrick-star-smash-gif-19642208',
	'https://tenor.com/view/spongebob-squarepants-patrick-star-drums-play-music-gif-5245203',
	'https://tenor.com/view/spongebob-happy-patrick-star-gif-21820750',
	'https://tenor.com/view/patrick-star-wow-gif-7230900',
	'https://tenor.com/view/patrick-star-dumb-gif-20952040',
	'https://tenor.com/view/patrick-star-sponge-bob-square-pants-stare-gif-12020717',
	'https://tenor.com/view/patrick-star-spongebob-patrick-squidward-snowball-gif-25346098',
	'https://tenor.com/view/patrick-star-big-belly-gif-25402180',
	'https://tenor.com/view/spongebob-squarepants-patrick-star-toons-cartoons-animation-gif-14827466',
];


function randomImage() {
	const randomValue = Math.floor(Math.random() * images.length);
	const image = images[randomValue];
	return image;
}