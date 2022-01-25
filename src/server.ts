import express, { Response } from 'express';
import cors from 'cors';

import config from './config/config';

import logger from './middlewares/logger';
import headers from './middlewares/headers';
import errorHandler from './middlewares/errorHandler';

import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import events from './routes/events';
import testing from './routes/testing';

const NAMESPACE = 'Server';

const server = express();

server.use(cors());
server.use((req, res, next) => logger(req, res, next, NAMESPACE));

server.use(express.json());

server.use(headers);

server.get('/', async (req, res: Response) => {
  res.status(200).send('Use another endpoint to use the api');
});

// Routes
server.use('/auth', authRoutes);
server.use('/users', usersRoutes);
server.use('/events', events);
server.use(testing);

server.use(errorHandler);

server.listen(config.server.port, () => {
  console.log(`Server running ...`);
});
