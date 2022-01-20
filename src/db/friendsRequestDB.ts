import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import BaseError from '../utils/Error';
import {
  mapUserEntries,
  sortUsersInOrder,
} from '../utils/helperFunctions';

import { UserEntry, User } from '../models/models';

export default async function AddContact(
  userID: string,
  friendID: string
) {
  await DBClient.connect();

  const userCollection = DBClient.collection.Users();

  const usersIDs = [new ObjectId(userID), new ObjectId(friendID)];

  const cursor = userCollection.aggregate<User>([
    {
      $match: {
        _id: { $in: usersIDs },
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        friends: {
          $cond: {
            if: { $eq: ['$_id', new ObjectId(userID)] },
            then: '$friends',
            else: '$$REMOVE',
          },
        },
        friendsRequests: {
          $cond: {
            if: { $eq: ['$_id', new ObjectId(userID)] },
            then: '$friendsRequests',
            else: '$$REMOVE',
          },
        },
      },
    },
  ]);

  const users = sortUsersInOrder<User>(
    await cursor.toArray(),
    usersIDs
  );

  if (!users[0]) throw new BaseError('User not found');

  if (!users[1]) throw new BaseError('Requested User not found');

  const userId = new ObjectId(userID);
  const requestedUserId = new ObjectId(friendID);

  const {
    friends,
    friendsRequests: { sent, received },
  } = users[0];

  if (
    friends.map(mapUserEntries).includes(requestedUserId.toString())
  )
    throw new BaseError('User already in friends list');

  if (sent.map(mapUserEntries).includes(requestedUserId.toString()))
    throw new BaseError('User already requested to be friends');

  if (
    received.map(mapUserEntries).includes(requestedUserId.toString())
  )
    throw new BaseError('User already requested to be friends');

  await userCollection.bulkWrite([
    {
      updateOne: {
        filter: { _id: new ObjectId(userId) },
        update: {
          $push: {
            'friendsRequests.sent': users[1]._id,
          },
        },
      },
    },
    {
      updateOne: {
        filter: { _id: new ObjectId(requestedUserId) },
        update: {
          $push: {
            'friendsRequests.received': users[0]._id,
          },
        },
      },
    },
  ]);

  return {
    _id: users[1]._id,
    username: users[1].username,
  } as UserEntry;
}
