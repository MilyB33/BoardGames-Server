import { Request, Response, NextFunction } from 'express';

import logging from '../config/logging';

const NAMESPACE = 'validateEvent';

function validateEvent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logging.info(NAMESPACE, 'validateEvent');

  const {
    location,
    date,
    time,
    game,
    description,
    town,
    maxPlayers,
  } = req.body.event;

  if (
    !location ||
    !description ||
    !date ||
    !time ||
    !game ||
    !town ||
    !maxPlayers
  ) {
    return res.status(400).json({
      message: 'Missing event information',
    });
  }

  if (!Number.isInteger(maxPlayers)) {
    return res.status(400).json({
      message: 'Max players must be a number',
    });
  }

  if (maxPlayers < 1) {
    return res.status(400).json({
      message: 'Max players must be greater than 0',
    });
  }

  if (maxPlayers > 30) {
    return res.status(400).json({
      message: 'Max players must be less than 10',
    });
  }

  next();
}

export default validateEvent;
