import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';

import logging from '../config/logging';

const NAMESPACE = 'checkEventKeys';

const checkEventKeys = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (_.isEmpty(req.body))
    return res.status(400).send({ message: 'No body' });

  console.log(req.body);

  const allowedKeys = [
    'location',
    'date',
    'time',
    'description',
    'game',
    'town',
    'maxPlayers',
    'isPrivate',
  ];

  for (let key in req.body.event) {
    if (!allowedKeys.includes(key)) {
      logging.error(
        `${NAMESPACE}: ${key} is not allowed property.`,
        req.body
      );

      return res.status(400).json({
        message: `${key} is not allowed property.`,
      });
    }
  }

  logging.info(NAMESPACE, 'checkEventKeys');

  next();
};

export default checkEventKeys;
