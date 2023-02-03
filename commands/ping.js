const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Pong!'),
    async execute(interaction) {
        await interaction.reply({ content: 'Pong!' });

        // this is how you can get the reply message object
        // const message = await interaction.fetchReply();
        // console.log(message);
    },
};