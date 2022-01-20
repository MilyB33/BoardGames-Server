import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import logging from '../config/logging';
import BaseError from '../utils/Error';

import {
  mapUserEntries,
  sortUsersInOrder,
} from '../utils/helperFunctions';

import { User } from '../models/models';

const NAMESPACE = 'acceptFriendsRequestDB';

export default async function AddContact(
  userID: string,
  friendID: string
) {
  logging.debug(NAMESPACE, 'getUsers');

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

  const {
    friends,
    friendsRequests: { received },
  } = users[0];

  if (friends.map(mapUserEntries).includes(users[1]._id.toString()))
    throw new BaseError('User already in friends list');

  if (!received.map(mapUserEntries).includes(users[1]._id.toString()))
    throw new BaseError('User is not requesting to be friends');

  const userId = users[0]._id;
  const requestedUserId = users[1]._id;

  await userCollection.bulkWrite([
    {
      updateOne: {
        filter: { _id: userId },
        update: {
          $push: {
            friends: requestedUserId,
          },
          $pull: {
            'friendsRequests.sent': requestedUserId,
            'friendsRequests.received': requestedUserId,
          },
        },
      },
    },
    {
      updateOne: {
        filter: { _id: requestedUserId },
        update: {
          $push: {
            friends: userId,
          },
          $pull: {
            'friendsRequests.sent': userId,
            'friendsRequests.received': userId,
          },
        },
      },
    },
  ]);

  return users[1];
}
