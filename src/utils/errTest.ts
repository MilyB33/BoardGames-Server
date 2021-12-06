import { BaseErr, ErrorTypes } from '../models/models';
import { Response } from 'express';

type Err = BaseErr | Error;

export default function errTest(
  err: Err,
  req: any,
  res: Response,
  next: Function
) {
  const { name } = err as Err;

  if (name === ErrorTypes.BaseError) {
    const { message, statusCode } = err as BaseErr;

    if (statusCode) res.status(statusCode).json({ message });
  } else res.status(500).json({ message: 'Something went wrong' });
}
