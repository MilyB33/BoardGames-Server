import { Request, Response, NextFunction } from 'express';

function validateEvent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { place, date, time, game, description } = req.body;

  if (!place || !description || !date || !time || !game) {
    return res.status(400).json({
      message: 'Missing event information',
    });
  }

  next();
}

export default validateEvent;
