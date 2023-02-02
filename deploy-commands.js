require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

// construct instance of REST class
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// deploy commands
(async () => {
    try {
        console.log(`Deploying ${commands.length} (/) commands...`);

        // the put method is used to fully refresh all the commands in the guild with current command set
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );
        console.log(`Successfully deployed ${data.length} (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();
