const { Client, GatewayIntentBits, Events } = require('discord.js');

require('dotenv').config();
require('../server');

const interactionHandler = require('./handlers/interactionHandler');

console.log("TOKEN EXISTS:", !!process.env.TOKEN);

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, c => {
  console.log(`✅ Logged in as ${c.user.tag}`);
});

client.on('error', err => {
  console.error("CLIENT ERROR:", err);
});

client.on('warn', warn => {
  console.warn("CLIENT WARN:", warn);
});

client.on(Events.InteractionCreate, interactionHandler);

(async () => {
  try {
    console.log("⏳ Attempting login...");

    await client.login(process.env.TOKEN);

    console.log("✅ LOGIN FUNCTION COMPLETED");

  } catch (err) {
    console.error("❌ LOGIN FAILED:", err);
  }
})();