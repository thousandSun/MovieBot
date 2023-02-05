const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
                .setName('recommend')
                .setDescription('Used to add a movie to the recommendation list for Movie Night')
                .addStringOption(option => 
                                    option.setName('title')
                                        .setDescription('The movies title')
                                        .setRequired(true)
                                        .setMaxLength(31))
                .addNumberOption(option => 
                                    option.setName('rating')
                                        .setDescription('What would you rate the movie?')
                                        .setMinValue(0.0)
                                        .setMaxValue(10.0)
                                        .setRequired(true)),
    async execute(interaction){
        const title = interaction.options.getString('title');
        const rating = interaction.options.getNumber('rating');

        if(!title || !rating){
            await interaction.reply({content: `Please make sure that the command entered has all required values.`});
            return;
        }

        await interaction.deferReply({content: 'The Bot is processing...'});

        // db connection to insert into database
        // insert into db using title casing

        await interaction.editReply({content: `Thank you for recommending '${title}' and giving it a ${rating.toFixed(1)}/10`})        
    },
};