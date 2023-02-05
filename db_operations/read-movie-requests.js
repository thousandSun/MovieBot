const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

async function readMovieRequest() {
    const movies = await prisma.movie.findMany();
    console.log(movies);

}

readMovieRequest()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })