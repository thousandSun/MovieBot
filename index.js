require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');

const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

// Create client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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

// run code once client is ready
client.once(Events.ClientReady, c => {
    console.log(`Logged in as ${c.user.tag}!`);
});

client.on(Events.InteractionCreate, async interaction => {
    // makes sure the interaction is for a command
    if (!interaction.isChatInputCommand()) return;

    // makes sure the command exists in the commands collection
    // bot client object will always be available at `interaction.client`
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.log(`[GRAVE] La comando '${interaction.commandName}' no existe.`);
        return;
    }

    // execute the command
    try {
        await command.execute(interaction);

    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
    console.log(interaction);
});


// login to discord
client.login(process.env.TOKEN);
