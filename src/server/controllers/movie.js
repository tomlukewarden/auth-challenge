import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const jwtSecret = 'mysecret';

const getAllMovies = async (req, res) => {
  const movies = await prisma.movie.findMany();
  res.json({ data: movies });
};

const createMovie = async (req, res) => {
  const { title, description, runtimeMins } = req.body;

  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log('Received Token:', token);
    jwt.verify(token, jwtSecret);

  } catch (error) {
    console.error('An error occurred during movie creation:', error);
    res.status(401).json({ error: 'Invalid token provided.' });
  }
  const createdMovie = await prisma.movie.create({
    data: {
      title,
      description,
      runtimeMins
    },
  });

  res.status(201).json({ data: createdMovie });
};

export { getAllMovies, createMovie };
