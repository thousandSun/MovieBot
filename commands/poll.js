const { SlashCommandBuilder } = require("discord.js");
const readMovieRequest = require('../db_operations/read-movie-requests');
const markWatched = require('../db_operations/mark-watched-requests');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('creates a new poll with movies to watch another'),
    async execute(interaction) {
        await interaction.reply({content: `Working on the new poll you have requested. One second please.`})
        const channel = interaction.channel;

        const result = await readMovieRequest();
        if(result.length == 0){
            await channel.send({content: `:bangbang: @everyone Looks like all the movies have been watched. Please /recommend more to have more options. :bangbang:`})
        }else{
            const shuffleArray = array => {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    const temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
            }
            shuffleArray(result);
    
            const movies = result.slice(0, 4);
    
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
                title: ':bangbang:Extra Movie:bangbang:',
                author: {
                    name: interaction.user.username
                },
                description: ':cinema: React with the associated emote to vote for the extra movie to watch. :popcorn:',
                fields: pollMovies,
                timestamp: new Date().toISOString(),
                footer: {
                    text: '🎉 Thank you for your interest in wanting to watch another movie. 🎉'
                }
            }
    
            const message = await channel.send({ content: `@everyone There was a request to watch another movie, what do yall feel like watching? (You have 3 minutes to vote)`, embeds: [pollEmbed], fetchReply: true });
            const filter = (reaction, user) => {
                return botReaction.includes(reaction.emoji.name)
            };
            const collector = message.createReactionCollector({ filter, time: 1000 * 60 * 3 });
    
            collector.on('end', async collected => {
                let winner = null;
                if (collected.size == 0) {
                    r = botReaction[Math.floor(Math.random() * botReaction.length)]
                    message.react(r);
                    for (let movie of pollMovies) {
                        if (movie.value.includes(r)) {
                            await channel.send({content: `@everyone There has been a winner! Looks like we're watching ✨${movie.name}✨`})
                            await markWatched(movie.name)
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
                            await channel.send({content: `@everyone There has been a winner! Looks like we're watching ✨${movie.name}✨`})
                            await markWatched(movie.name)
                        }
                    }
                }
            });
        }
    }
}
