const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction){
        // if the interaction is not a command
        if(!interaction.isChatInputCommand()) return;

        // get the command from the registered commands in the client
        const command = interaction.client.commands.get(interaction.commandName);

        // if the command could not be found
        if(!command){
            console.log(`[ERROR] La commando ${interaction.commandName} no pudo ser encontrada.`);
            return;
        }

        // if the command does exist
        try{
            await command.execute(interaction);
        }catch (error){
            console.log(`There was an error running ${interaction.commandName}`);
            console.log(error)
            await interaction.reply({content: "There was an error running that command. Please check to make sure it's a valid command.", ephemeral: true});
        }
    },
};