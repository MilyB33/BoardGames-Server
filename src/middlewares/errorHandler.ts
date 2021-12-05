import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new Error('Not Found');

  return res.status(404).json({
    message: error.message,
  });
};

export default errorHandler;
