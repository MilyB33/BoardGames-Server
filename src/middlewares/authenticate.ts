import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

import logging from '../config/logging';

import dotenv from 'dotenv';

dotenv.config();

const NAMESPACE = 'Authenticate';

interface DecodedToken {
  id: string;
  iat: number;
  usernames: string;
}

async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  const decoded = jwt.decode(token) as DecodedToken;

  if (decoded == null) return res.sendStatus(401);

  if (req.params.userID)
    if (req.params.userID.toString() !== decoded.id.toString())
      return res.sendStatus(401);

  if (process.env.JWT_SECRET !== null)
    jwt.verify(
      token,
      process.env.JWT_SECRET as Secret,
      (err, user) => {
        logging.info(NAMESPACE, 'verify');

        if (err) return res.sendStatus(403);

        req.user = user;

        next();
      }
    );
}

export default authenticate;
