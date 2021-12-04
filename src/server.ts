import express, { Response } from 'express';
import cors from 'cors';

import register from './db/register';
import login from './db/login';

import { BaseErr } from './utils/types';

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
    const { message, statusCode } = err as BaseErr;

    res.status(statusCode || 500).json({ message });
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
    const { message, statusCode } = err as BaseErr;

    res.status(statusCode || 500).json({ message });
  }
});

server.listen(port, () => {
  console.log(`Server running ...`);
});
