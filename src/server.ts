import express, { Response } from 'express';
import cors from 'cors';

import logger from './middlewares/logger';
import headers from './middlewares/headers';
import errorHandler from './middlewares/errorHandler';

import usersRoutes from './routes/users';
import posts from './routes/posts';
import events from './routes/events';

const NAMESPACE = 'Server';

const server = express();

const port = process.env.PORT || 8080;

server.use(cors());
server.use((req, res, next) => logger(req, res, next, NAMESPACE));

server.use(express.json());

server.use(headers);

server.get('/', async (req, res: Response) => {
  res.status(200).send('Use another endpoint to use the api');
});

// Routes
server.use(usersRoutes);
server.use(posts);
server.use(events);

server.use(errorHandler);

server.listen(port, () => {
  console.log(`Server running ...`);
});
