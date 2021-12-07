import { Request, Response, NextFunction } from 'express';

import logging from '../config/logging';

const NAMESPACE = 'validateEvent';

function validateEvent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logging.info(NAMESPACE, 'validateEvent');

  const { place, date, time, game, description } = req.body;

  if (!place || !description || !date || !time || !game) {
    return res.status(400).json({
      message: 'Missing event information',
    });
  }

  next();
}

export default validateEvent;
