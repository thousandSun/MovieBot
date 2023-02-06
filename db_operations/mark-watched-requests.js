const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function markWatched(name){
    await prisma.movie.updateMany({
        where: {
            title: name
        },
        data: {
            watched: true
        }
    })
}

module.exports = markWatched;