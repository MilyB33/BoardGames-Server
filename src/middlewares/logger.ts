import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';

const logger = (
  req: Request,
  res: Response,
  next: NextFunction,
  namespace: string
) => {
  logging.info(
    namespace,
    `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`
  );

  res.on('finish', () => {
    logging.info(
      namespace,
      `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`
    );
  });

  next();
};

export default logger;
