let steamResults;

async function generateSteamApi(){
	const api = 'https://api.steampowered.com/ISteamApps/GetAppList/v0002/';
	const res = await request(api);
	const json = res.body.json();
	steamResults = json;
}

function getResults(){
	if(steamResults != null){
		return steamResults;
	}else{
		console.log("ERROR RESULTS ARE NULL")
	}
}

module.exports = { getResults };