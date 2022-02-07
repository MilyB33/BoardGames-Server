import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

import logging from '../config/logging';
import { Secrets } from '../models/models';

const NAMESPACE = 'checkUserData';

const checkUserData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logging.info(NAMESPACE, 'Checking user data');

  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Please provide username and password',
      });
    }
  } else {
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = jwt.decode(token) as JwtPayload;

    if (decoded == null) {
      return res.status(401).json({
        message: 'Invalid token',
      });
    }

    if (process.env.JWT_SECRET !== null)
      jwt.verify(
        token,
        process.env.JWT_SECRET as Secret,
        (err, user) => {
          logging.info(NAMESPACE, 'verify in checkUserData');

          if (err) return res.sendStatus(403);

          req.body = {
            ...user,
            token,
          };
        }
      );
  }

  next();
};

export default checkUserData;
