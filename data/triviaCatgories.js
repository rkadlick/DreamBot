function triviaCategoryToColor(category) {

	let color = '';

	switch (category) {
	case 'General Knowledge':
		color = '#3B83BD';
		break;
	case 'Entertainment: Books':
		color = '#922B3E';
		break;
	case 'Entertainment: Film':
		color = '#5E2129';
		break;
	case 'Etnertainment: Music':
		color = '#C51D34';
		break;
	case 'Entertainment: Musicals & Theatres':
		color = '#690f0f';
		break;
	case 'Entertainment: Television':
		color = '#EAE6CA';
		break;
	case 'Entertainment: Video Games':
		color = '#497E76';
		break;
	case 'Entertainment: Board Games':
		color = '#C2B078';
		break;
	case 'Entertainment: Japanese Anime & Manga':
		color = '#B44C43';
		break;
	case 'Entertainment: Cartoon & Animations':
		color = '#FFA420';
		break;
	case 'Entertainment: Comics':
		color = '#E1CC4F';
		break;
	case 'Science & Nature':
		color = '#4C9141';
		break;
	case 'Science: Computers':
		color = '#474A51';
		break;
	case 'Science: Mathematics':
		color = '#C35831';
		break;
	case 'Science: Gadgets':
		color = '#015D52';
		break;
	case 'Mythology':
		color = '#84C3BE';
		break;
	case 'Sports':
		color = '#FF2301';
		break;
	case 'Geography':
		color = '#705335';
		break;
	case 'History':
		color = '#AEA04B';
		break;
	case 'Politics':
		color = '#8B8C7A';
		break;
	case 'Art':
		color = '#6C4675';
		break;
	case 'Celebrities':
		color = '#A03472';
		break;
	case 'Animals':
		color = '#F3A505';
		break;
	case 'Vehicles':
		color = '#1E213D';
		break;
	default:
		color = '#FFFFFF';
	}
	return color;
}

module.exports = { triviaCategoryToColor };