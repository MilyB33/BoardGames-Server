import { Request, Response } from 'express';

import errorHelper from '../utils/errorHelper';
import loginDB from '../db/loginDB';
import registerDB from '../db/registerDB';

const login = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong during logging in',
    async () => {
      const result = await loginDB(req.body);

      res.status(200).send({ message: 'User logged in', result });
    }
  );

const register = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong during registration',
    async () => {
      await registerDB(req.body);

      res.status(200).send({ message: 'User created', result: null });
    }
  );

export default {
  login,
  register,
};
