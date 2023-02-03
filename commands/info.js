const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
                .setName("info")
                .setDescription("A command to get more information")
                // gives the `info` command further commands for more control
                .addSubcommand(subcommand => subcommand
                    .setName("user")
                    .setDescription("Gets information about a user")
                    // adds the ability to specify user object to target
                    .addUserOption(option => option.setName("target").setDescription("The user you want information about")))
                .addSubcommand(subcommand => subcommand
                    .setName("server")
                    .setDescription("Gives information about the server you are in")),
    async execute(interaction){
        // gets the subcommands and checks what was passed
        if(interaction.options.getSubcommand() === "user"){
            // gets the user object the user passed in
            const user = interaction.options.getUser("target");

            if(user){
                await interaction.reply({content: `Username: ${user.username}\nID: ${user.tag}`});
                const channel = await user.createDM();
                const message = await channel.send(`Heads up! <${interaction.user.username}> requested more information about you from the server <${interaction.guild.name}>`);
            }else{
                await interaction.reply({content: `This is your information:\n\tUsername: ${interaction.user.username}\n\tID: ${interaction.user.tag}`});
            }
        }else if(interaction.options.getSubcommand() === "server"){
            await interaction.reply({content: `Server Information:\n\tName: ${interaction.guild.name}\n\t${interaction.guild.memberCount-1}`});
        }
    },
};