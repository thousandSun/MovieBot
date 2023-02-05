const { PrismaClient } = require('@prisma/client');
const titleize = require('../utils/titleize.js');

const prisma = new PrismaClient()

async function createMovieRequest(title, rating) {
    const fmtedString = titleize(title);
    const newMovie = await prisma.movie.create({
        data: {
          title: fmtedString,
          rating 
        },
    }); 
};

module.exports = createMovieRequest;