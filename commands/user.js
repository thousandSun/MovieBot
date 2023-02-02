const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('user').setDescription('Provides information about a user that ran the command.'),
    async execute(interaction) {
        // interaction.user is the User that ran the command
        // interaction.member is the GuildMember object that ran the command
        await interaction.reply({ content: `<@${interaction.user.id}> ran this command from <${interaction.guild}> Server` });
    },
};