const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('serverinfo').setDescription('provides information about the server'),
    async execute(interaction) {
        await interaction.reply({ content: `Server name: ${interaction.guild.name}\nServer id: ${interaction.guild.id}\nMember Count:${interaction.guild.memberCount - 1}` });
    },
};