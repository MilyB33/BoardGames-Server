import { Request, Response } from 'express';
import { BaseErr, ErrorTypes } from '../utils/types';

import MongoCustomClient from '../clients/mongoClient';

import loginDB from '../db/loginDB';
import registerDB from '../db/registerDB';

const login = async (req: Request, res: Response) => {
  try {
    const userData = await loginDB(req.body);

    res.status(200).json({
      message: 'User logged in',
      user: userData,
    });
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

const register = async (req: Request, res: Response) => {
  try {
    await registerDB(req.body);

    res.status(200).json({ message: 'User created' });
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
  login,
  register,
};
