import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import logging from '../config/logging';
import BaseError from '../utils/Error';

import {
  sortUsersInOrder,
  mapIds,
  mapUserEntries,
} from '../utils/helperFunctions';

import { User } from '../models/models';

const NAMESPACE = 'rejectFriendsRequestDB';

export default async function rejectFriendsRequest(
  userID: string,
  friendID: string
): Promise<void> {
  logging.debug(NAMESPACE, 'rejectFriendsRequest');

  await DBClient.connect();

  const userCollection = DBClient.collection.Users();

  const usersIDs = [userID, friendID].map(mapIds);

  const userIDObject = new ObjectId(userID);
  const friendIDObject = new ObjectId(friendID);

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
        friends: 1,
        friendsRequests: {
          $cond: {
            if: { _id: userIDObject },
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

  if (!users[0]) throw new BaseError('User not found', 404);

  if (!users[1])
    throw new BaseError('Requesting User not found', 404);

  const {
    friends,
    friendsRequests: { received },
  } = users[0];

  if (friends.map(mapUserEntries).includes(users[1]._id.toString()))
    throw new BaseError('User already in friends list', 404);

  if (!received.map(mapUserEntries).includes(users[1]._id.toString()))
    throw new BaseError('User is not requesting to be friends', 404);

  await userCollection.bulkWrite([
    {
      updateOne: {
        filter: { _id: userIDObject },
        update: {
          $pull: {
            'friendsRequests.received': users[1]._id,
          },
        },
      },
    },
    {
      updateOne: {
        filter: { _id: friendIDObject },
        update: {
          $pull: {
            'friendsRequests.sent': users[0]._id,
          },
        },
      },
    },
  ]);
}
