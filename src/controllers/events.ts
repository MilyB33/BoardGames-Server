import MongoCustomClient from '../clients/mongoClient';
import { Request, Response } from 'express';
import { ErrorTypes, BaseErr } from '../models/models';

import addEvent from '../db/addEventDB';

const add = (req: Request, res: Response) => {
  try {
    addEvent(req.user, req.body);
  } catch (err) {
    const { name } = err as Error | BaseErr;

    if (name === ErrorTypes.BaseError) {
      const { message, statusCode } = err as BaseErr;
      if (statusCode) res.status(statusCode).json({ message });
    } else res.status(500).json({ message: 'Something went wrong' });
  } finally {
    MongoCustomClient.close();
  }
};

export default {
  add,
};
