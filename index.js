require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');

const { Client, Collection, GatewayIntentBits } = require('discord.js');

// Create client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions] });

// load commands
client.commands = new Collection();

// constructs the path to the commands folder
const commandsPath = path.join(__dirname, 'commands');

// loads each command file in the commands folder that only has a.js extension
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// iterate through each command file in the commands folder
for (const file of commandFiles) {
    // create path to individual command files
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // add the command to the collection
    if ('data' in command && 'execute' in command) {
        // key is the command name, value is the exported module object
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[OJO] La command localizada en '${filePath}' no tiene los attributos de 'data' o 'execute'.`);
    }
}

const eventsPath = path.join(__dirname, "events");
const eventFiiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiiles){
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if(event.once){
        client.once(event.name, (...args) => event.execute(...args));
    }else{
        client.on(event.name, (...args) => event.execute(...args))
    }
}


// login to discord
client.login(process.env.TOKEN);
