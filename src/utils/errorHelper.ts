import MongoCustomClient from '../clients/mongoClient';

import BaseErr from './Error';

import { ErrorTypes } from '../models/models';
import { Request, Response } from 'express';

export default async function errorHelper(
  req: Request,
  res: Response,
  customErrorMessage: string,
  callback: Function
) {
  try {
    await callback();
  } catch (err) {
    const { name } = err as Error | BaseErr;

    if (name === ErrorTypes.BaseError) {
      const { message, statusCode } = err as BaseErr;
      if (statusCode) res.status(statusCode).send({ message });
    } else res.status(500).send(customErrorMessage);
  } finally {
    MongoCustomClient.close();
  }
}
