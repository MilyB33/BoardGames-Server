import DBClient from '../clients/mongoClient';
import bcrypt from 'bcrypt';

import jwt, { Secret } from 'jsonwebtoken';
import BaseError from '../utils/Error';
import { Secrets, UserWithEvents } from '../models/models';

import logging from '../config/logging';

const NAMESPACE = 'loginDB';

export default async function login(
  secrets: Secrets
): Promise<UserWithEvents> {
  logging.info(NAMESPACE, 'login');

  const { username, password } = secrets;

  await DBClient.connect();

  const collection = DBClient.collection.Users();

  const user = collection.aggregate<UserWithEvents>([
    { $match: { username } },
    {
      $lookup: {
        from: 'Events',
        let: { userId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$createdBy._id', '$$userId'],
              },
            },
          },
          { $limit: 5 },
        ],
        as: 'events.userEvents',
      },
    },
    {
      $lookup: {
        from: 'Events',
        let: { userID: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ['$$userID', '$signedUsers'] },
                  { $not: { $eq: ['$$userID', '$createdBy._id'] } },
                ],
              },
            },
          },
          { $limit: 5 },
        ],
        as: 'events.userSignedEvents',
      },
    },
    {
      $lookup: {
        from: 'Users',
        let: { userID: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$$userID', '$friends'],
              },
            },
          },
          { $limit: 5 },
        ],
        as: 'friends',
      },
    },
    {
      $lookup: {
        from: 'Users',
        let: { userID: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$$userID', '$friendsRequests.received'],
              },
            },
          },
          { $limit: 5 },
          {
            $project: {
              _id: 1,
              username: 1,
            },
          },
        ],
        as: 'friendsRequests.sent',
      },
    },
    {
      $lookup: {
        from: 'Users',
        let: { userID: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$$userID', '$friendsRequests.sent'],
              },
            },
          },
          { $limit: 5 },
          {
            $project: {
              _id: 1,
              username: 1,
            },
          },
        ],
        as: 'friendsRequests.received',
      },
    },
  ]);

  let userData = await user.next();

  if (!userData!) throw new BaseError('User not found', 404);

  const { password: hashedPassword } = userData;

  const isSame = await bcrypt.compare(password, hashedPassword);
  if (!isSame) throw new BaseError('Invalid password', 401);

  const token = jwt.sign(
    { username, id: userData._id },
    process.env.JWT_SECRET as Secret
    // { expiresIn: '1h' } For now we don't need to expire the token
  );

  return {
    ...userData,
    token,
  };
}
