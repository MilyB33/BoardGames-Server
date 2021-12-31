import { Request, Response, NextFunction } from 'express';

import logging from '../config/logging';

const NAMESPACE = 'checkUserData';

const checkUserData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logging.info(NAMESPACE, 'Checking user data');

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Please provide username and password',
    });
  }

  next();
};

export default checkUserData;
