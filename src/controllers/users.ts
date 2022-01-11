import { Request, Response } from 'express';

import loginDB from '../db/loginDB';
import registerDB from '../db/registerDB';
import deleteUserDB from '../db/deleteUserDB';
import updatePasswordDB from '../db/updatePasswordDB';
import getUsersDB from '../db/getUsersDB';
import friendsRequestDB from '../db/friendsRequestDB';
import errorHelper from '../utils/errorHelper';

const getUsers = async (req: Request, res: Response) =>
  errorHelper(req, res, 'Error getting users', async () => {
    const result = await getUsersDB(req.query);

    res.status(200).send({ message: 'Users retrieved', result });
  });

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

const deleteUser = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong during deleting',
    async () => {
      await deleteUserDB(req.params.userID);

      res.status(200).send({ message: 'User deleted', result: null });
    }
  );

const updatePassword = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong during updating',
    async () => {
      await updatePasswordDB(req.params.userID, req.body);

      res.status(200).send({ message: 'User updated', result: null });
    }
  );

const sendFriendsRequest = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong during sending request',
    async () => {
      await friendsRequestDB(req.params, req.query);

      res.status(200).send({ message: 'Request sent', result: null });
    }
  );

// const addUserAsContact = async (req: Request, res: Response) =>
//   errorHelper(
//     req,
//     res,
//     'Something went wrong during adding',
//     async () => {
//       res.status(200).send({ message: 'User added', result: null });
//     }
//   );

export default {
  getUsers,
  login,
  register,
  deleteUser,
  updatePassword,
  sendFriendsRequest,
  // addUserAsContact,
};
