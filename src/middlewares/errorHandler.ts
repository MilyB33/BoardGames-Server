import { Request, Response, NextFunction } from 'express';

import logging from '../config/logging';

const NAMESPACE = 'errorHandler';

const errorHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logging.info(NAMESPACE, 'errorHandler');

  const error = new Error('Not Found');

  return res.status(404).json({
    message: error.message,
  });
};

export default errorHandler;
