const { Client, GatewayIntentBits, Events } = require('discord.js');
require('dotenv').config();
require('../server');

const interactionHandler = require('./handlers/interactionHandler');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('clientReady', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, interactionHandler);

client.login(process.env.TOKEN)
  .catch(err => console.error("LOGIN ERROR:", err));