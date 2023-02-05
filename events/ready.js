const { Events, EmbedBuilder } = require('discord.js');
const cron = require('cron').CronJob;

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        const sendFridayPoll = new cron('0 17 * * 5', async function(){
            const guild = await client.guilds.cache.get('1070448397653397585');
            if (guild) {
                const channel = guild.channels.cache.get('1070448550955208784');

                // TODO:
                // get 4 random unwatched movies from the db
                // replace `Movie n` with movie name

                const pollEmbed = new EmbedBuilder()
                    .setColor(0xE05263)
                    .setTitle('Movie Night Poll')
                    .setAuthor({ name: client.user.username })
                    .setDescription('React with the associated emote to vote for the movie to watch tonight.')
                    .addFields({ name: 'Movie 1', value: ':one:', inline: true }, { name: 'Movie 2', value: ':two:', inline: true })
                    .addFields({ name: '\u200B', value: '\u200B' })
                    .addFields({ name: 'Movie 3', value: ':three:', inline: true }, { name: 'Movie 4', value: ':four:', inline: true })
                    .setTimestamp()
                    .setFooter({ text: 'Thank you for participating in this poll. See you next week!' });

                const message = await channel.send({ content: ` It's Friday, that means movie poll time! (You have 30 mintes to vote)`, embeds: [pollEmbed], fetchReply: true });
                const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];
                const filter = (reaction, user) => {
                    return ['1️⃣', '2️⃣', '3️⃣', '4️⃣'].includes(reaction.emoji.name)
                };
                const collector = message.createReactionCollector({ filter, time: 20000 });

                let winner = null;
                collector.on('end', collected => {
                    console.log(`collected ${collected.size} reactions`)
                    let maxVotes = -9999999
                    let tie = false;
                    for (let reaction of collected.values()) {
                        if (reaction.count > maxVotes) {
                            winner = reaction._emoji.name;
                            maxVotes = reaction.count
                        } else if (reaction.count == maxVotes) {
                            const tie = [reaction._emoji.name, winner]
                            winner = tie[Math.floor(Math.random() * tie.length)]
                            tie = true;
                        }
                    }
                    if (tie) {
                        message.react(winner);
                    }
                });
            }
        });
        // sendFridayPoll.start();
        console.log(`Ready! Logged in as ${client.user.tag}`);
    }
};