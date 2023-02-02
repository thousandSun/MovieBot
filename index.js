require('dotenv').config();
const { Client, Events, GatewayIntentBits } = require('discord.js');

// Create client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// run code once client is ready
client.once(Events.ClientReady, c => {
    console.log(`Logged in as ${c.user.tag}!`);
});

// login to discord
client.login(process.env.TOKEN);
