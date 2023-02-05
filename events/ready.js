const { Events, EmbedBuilder } = require('discord.js');
const cron = require('cron').CronJob

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client){
        // const sendFridayPoll = new cron('0 17 * * 5', async function(){
        //     const guild = client.guilds.cache.get('1070448397653397585');
        //     const everyone = guild.roles.fetch('@everyone');
        //     if(guild){
        //         const channel = guild.channels.cache.get('1071122301426339850');

        //         // TODO:
        //         // get 4 random unwatched movies from the db
        //         // replace `Movie n` with movie name

        //         const pollEmbed = new EmbedBuilder()
        //             .setColor(0xE05263)
        //             .setTitle('Movie Night Poll')
        //             .setAuthor({name: client.user.username, iconURL: guild.icon})
        //             .setDescription('React with the associated emote to vote for the movie to watch tonight.')
        //             .setThumbnail(guild.icon)
        //             .addFields({name: 'Movie 1', value: ':one:'})
        //             .addFields({name: 'Movie 2', value: ':two:'})
        //             .addFields({name: 'Movie 3', value: ':three:'})
        //             .addFields({name: 'Movie 4', value: ':four:'})
        //             .setTimestamp()
        //             .setFooter({text: 'Thank you for participating in this poll. See you next week!'});

        //         const message = await channel.send({content: `${everyone} It's Friday, that means movie poll time!`, embeds: [pollEmbed], fetchReply: true});
        //         const reactions = [':one:', ':two:', ':three:', ':four:'];
        //         const reaction = reactions[Math.floor(Math.random()*reactions.length)];
        //         message.react(reaction);
        //     }
        // });
        // sendFridayPoll.start();
        console.log(`Ready! Logged in as ${client.user.tag}`);
    }
};