const { Events, EmbedBuilder } = require('discord.js');
const cron = require('cron').CronJob;
const readMovieRequest = require('../db_operations/read-movie-requests');
const updateWatched = require('../db_operations/mark-watched-requests');
const markWatched = require('../db_operations/mark-watched-requests');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {

        const sendFridayPoll = new cron('0 17 * * 5', async function () {
            const guild = await client.guilds.cache.get('1070448397653397585');
            if (guild) {
                const channel = guild.channels.cache.get('1071122301426339850');

                // TODO:
                // get 4 random unwatched movies from the db
                // replace `Movie n` with movie name


                const movies = await readMovieRequest();

                const reactions = ['4️⃣', '3️⃣', '2️⃣', '1️⃣'];
                const pollMovies = [];
                const botReaction = []
                const emptyField = {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false
                }
                let cnt = 1;
                pollMovies.push(emptyField);
                let pushEnd = true;
                for (let movie of movies) {
                    let r = reactions.pop()
                    botReaction.push(r)
                    let m = {
                        name: `${movie.title}`,
                        value: `Rating: (${movie.rating.toFixed(1)}/10.0) Vote: ${r}`,
                        inline: true
                    };
                    pollMovies.push(m);

                    if (cnt % 2 == 0) {
                        pushEnd = false
                        pollMovies.push(emptyField);
                    } else {
                        pushEnd = true;
                    }
                    cnt++;
                }
                if (pushEnd) {
                    pollMovies.push(emptyField);
                }

                const pollEmbed = {
                    color: 0xE05263,
                    title: ':bangbang:Movie Night Poll:bangbang:',
                    author: {
                        name: client.user.username
                    },
                    description: ':cinema: React with the associated emote to vote for the movie to watch tonight. :popcorn:',
                    fields: pollMovies,
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: '🎉 Thank you for participating in this poll. See you next week! 🎉'
                    }
                }

                const message = await channel.send({ content: `@everyone It's Friday, that means movie poll time! (You have 1 hour to vote)`, embeds: [pollEmbed], fetchReply: true });
                const filter = (reaction, user) => {
                    return botReaction.includes(reaction.emoji.name)
                };
                const collector = message.createReactionCollector({ filter, time: 1000*60*60 });

                collector.on('end', async collected => {
                    let winner = null;
                    if (collected.size == 0) {
                        r = botReaction[Math.floor(Math.random() * botReaction.length)]
                        message.react(r);
                        for (let movie of pollMovies) {
                            if (movie.value.includes(r)) {
                                await updateWatched(movie.name)
                            }
                        }
                    } else {
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
                        for (let movie of pollMovies) {
                            if (movie.value.includes(winner)) {
                                await updateWatched(movie.name)
                            }
                        }
                    }
                });
            }
        });
        sendFridayPoll.start();
        console.log(`Ready! Logged in as ${client.user.tag}`);
    }
};