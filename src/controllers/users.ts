import { Request, Response } from 'express';

import loginDB from '../db/loginDB';
import registerDB from '../db/registerDB';
import errorHelper from '../utils/errorHelper';

const login = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong during logging in',
    async () => {
      const userData = await loginDB(req.body);

      res.status(200).json({
        message: 'User logged in',
        user: userData,
      });
    }
  );

const register = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong during registration',
    async () => {
      await registerDB(req.body);

      res.status(200).json({ message: 'User created' });
    }
  );

// const register = async (req: Request, res: Response) => {
//   try {
//     await registerDB(req.body);

//     res.status(200).json({ message: 'User created' });
//   } catch (err) {
//     const { name } = err as Error | BaseErr;

//     if (name === ErrorTypes.BaseError) {
//       const { message, statusCode } = err as BaseErr;
//       if (statusCode) res.status(statusCode).json({ message });
//     } else res.status(500).json({ message: 'Something went wrong' });
//   } finally {
//     MongoCustomClient.close();
//   }
// };

export default {
  login,
  register,
};
