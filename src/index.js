const { Client, GatewayIntentBits, Events } = require('discord.js');
require('dotenv').config();
require('../server');
const interactionHandler = require('./handlers/interactionHandler');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.on('clientReady', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, interactionHandler);
console.log("TOKEN EXISTS:", process.env.TOKEN);

client.login(process.env.TOKEN)
  .then(() => console.log("LOGIN STARTED"))
  .catch(err => console.error("LOGIN ERROR:", err));
