import express, { Response } from 'express';
import cors from 'cors';
import MongoCustomClient from './clients/mongoClient';

import register from './db/register';
import login from './db/login';

import { BaseErr, ErrorTypes } from './utils/types';

const server = express();

const port = process.env.PORT || 3000;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());

server.get('/', async (req, res: Response) => {
  res.status(200).send('Use another endpoint to use the api');
});

// Users endpoints
server.post('/register', async (req, res) => {
  try {
    await register(req.body);

    res.status(200).json({ message: 'User created' });
  } catch (err) {
    const { name } = err as Error | BaseErr;

    if (name === ErrorTypes.BaseError) {
      const { message, statusCode } = err as BaseErr;

      if (statusCode) res.status(statusCode).json({ message });
    } else res.status(500).json({ message: 'Something went wrong' });
  } finally {
    MongoCustomClient.close();
  }
});

server.post('/login', async (req, res) => {
  try {
    const userData = await login(req.body);
    res.status(200).json({
      message: 'User logged in',
      user: userData,
    });
  } catch (err) {
    const { name } = err as Error | BaseErr;

    if (name === ErrorTypes.BaseError) {
      const { message, statusCode } = err as BaseErr;
      if (statusCode) res.status(statusCode).json({ message });
    } else res.status(500).json({ message: 'Something went wrong' });
  } finally {
    MongoCustomClient.close();
  }
});

server.listen(port, () => {
  console.log(`Server running ...`);
});
