# Dream Bot

This repository contains a simple Discord bot that I created as a learning endeavor. The bot has limited commands, but is in use in a private discord server amongst my friends.

## Getting Started

To use this bot, you will need to do the following:

1. Clone this repository to your local machine.
2. Install the necessary dependencies by running `npm install discord.js` and `npm install axios`. If you do not have nodejs you will need to install it
3. Set up a Discord bot and obtain a bot token.
4. Create a `config.json` file in the root directory of the project and add the following:

  
<code>{
    "clientId": "Bot ID",
    "guildId": "your discord server ID",
    "token": "your bot token",
      }</code>
  

5. Run the bot by running `node index.js` or `node .`. 

Disclaimer: Certain files are related to the gaming commands and database are hidden due to privacy concerns.

## Available Commands

Currently, the bot supports the following commands:

### Basic
- `/server`: Fetch server information.
- `/user`: Fetch user information.
- `/ping`: Replies with "Pong!".

### Fun
- `/marvel`: Replies with the next Marvel movie to be released and how many days away.
- `/patrick`: Replies with a random gif of Patrick Star.
- `/pokeimg [input]`: Replies with an image of the pokemon entered as input.

### Games Database
The bot is configured to display a table in a specific Discord channel at midnight every night, this only occurs when changes to the database were made during the day. This table includes the name and price of a Steam game, as well as boolean columns for Discord members to show ownership of the game.

- `/add_game [input]`: Adds a Steam game, entered as input, and the price to a table in the database.
- `/update_game [input]`: Updates price of game that is currently in the database.
- `/mark [input] [boolean]`: Marks the user's ownership of the game in the database as true or false.

## Screenshots
[![Marvel Command](https://i.postimg.cc/MHNWTQN6/Screenshot-2023-03-14-at-8-12-19-PM.jpg)](https://postimg.cc/RJ1rpNvy)

[![Games Table](https://i.postimg.cc/6qyWt0Hb/Screenshot-2023-03-14-at-8-11-48-PM.jpg)](https://postimg.cc/BPf9Cxf2)

## Apis Used

- `https://pokeapi.co/api/v2/pokemon/POKEMONNAME` - accesses individual pokemon information (replace POKEMONNAME with pokemon name);
- `https://www.whenisthenextmcufilm.com/api?date=DATE` - access next Marvel movie information (replace DATE with a date). 
- `https://api.steampowered.com/ISteamApps/GetAppList/v0002/` - used to collect all Steam games.
- `https://store.steampowered.com/api/appdetails?appids=GAMEID&cc=us&l=en` - accesses individual Steam game information (Replace GAMEID with game's id).

## Contributing

This bot is a personal learning project, so contributions are not currently being accepted. However, feel free to fork this repository and modify the code to suit your needs.
