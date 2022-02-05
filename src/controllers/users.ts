import { Request, Response } from 'express';

import deleteUserDB from '../db/deleteUserDB';
import updatePasswordDB from '../db/updatePasswordDB';
import getUsersDB from '../db/getUsersDB';
import friendsRequestDB from '../db/friendsRequestDB';
import acceptFriendsRequestDB from '../db/acceptFriendsRequestDB';
import rejectFriendsRequestDB from '../db/rejectFriendsRequestDB';
import deleteFriendDB from '../db/deleteFriendDB';
import eventRequestDB from '../db/eventRequestDB';
import rejectEventRequestDB from '../db/rejectEventRequestDB';
import acceptEventRequestDB from '../db/acceptEventRequestDB';
import getUserInfoDB from '../db/getUserInfoDB';
import errorHelper from '../utils/errorHelper';

const getUsers = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong while getting users',
    async () => {
      const result = await getUsersDB(req.query);

      res.status(200).send({ message: 'Users retrieved', result });
    }
  );

const getUserInfo = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong while getting user info',
    async () => {
      const result = await getUserInfoDB(req.params.userID);

      res
        .status(200)
        .send({ message: 'User info retrieved', result });
    }
  );

const deleteUser = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong while deleting',
    async () => {
      await deleteUserDB(req.params.userID);

      res.status(200).send({ message: 'User deleted', result: null });
    }
  );

const updatePassword = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong while updating password',
    async () => {
      await updatePasswordDB(req.params.userID, req.body);

      res.status(200).send({ message: 'User updated', result: null });
    }
  );

const sendFriendsRequest = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong while sending friend request',
    async () => {
      const result = await friendsRequestDB(
        req.params.userID,
        req.params.friendID
      );

      res.status(200).send({ message: 'Request sent', result });
    }
  );

const acceptFriendsRequest = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong while accepting friend request',
    async () => {
      const result = await acceptFriendsRequestDB(
        req.params.userID,
        req.params.friendID
      );

      res.status(200).send({ message: 'Request accepted', result });
    }
  );

const rejectFriendsRequest = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong while rejecting friend request',
    async () => {
      await rejectFriendsRequestDB(
        req.params.userID,
        req.params.friendID
      );

      res
        .status(200)
        .send({ message: 'Request rejected', result: null });
    }
  );

const deleteFriend = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong while deleting friend',
    async () => {
      await deleteFriendDB(req.params.userID, req.params.friendID);

      res
        .status(200)
        .send({ message: 'Friend deleted', result: null });
    }
  );

const eventsRequests = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong while sending event request',
    async () => {
      const result = await eventRequestDB(
        req.params.userID,
        req.body
      );

      res.status(200).send({ message: 'Request sent', result });
    }
  );

const rejectEventRequest = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong while rejecting event request',
    async () => {
      await rejectEventRequestDB(req.params.inviteId);

      res
        .status(200)
        .send({ message: 'Request rejected', result: null });
    }
  );

const acceptEventRequest = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong while accepting event request',
    async () => {
      const result = await acceptEventRequestDB(req.params.inviteId);

      res.status(200).send({ message: 'Request accepted', result });
    }
  );

export default {
  getUsers,
  getUserInfo,
  deleteUser,
  updatePassword,
  sendFriendsRequest,
  acceptFriendsRequest,
  rejectFriendsRequest,
  deleteFriend,
  eventsRequests,
  rejectEventRequest,
  acceptEventRequest,
};
