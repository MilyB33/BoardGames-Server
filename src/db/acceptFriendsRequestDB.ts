import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import logging from '../config/logging';
import BaseError from '../utils/Error';
import mongoQueries from '../models/mongoAggregateQueries';

import {
  sortUsersInOrder,
  mapIds,
  mapUserEntries,
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

  const usersIDs = [userID, friendID].map(mapIds);

  const cursor = userCollection.aggregate<User>([
    { $match: { _id: { $in: usersIDs } } },
    mongoQueries.userQuery.userEntryWithFriends(userID),
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

  const userId = users[0]._id;
  const requestedUserId = users[1]._id;

  if (
    friends.map(mapUserEntries).includes(requestedUserId.toString())
  )
    throw new BaseError('User already in friends list');

  if (
    !received.map(mapUserEntries).includes(requestedUserId.toString())
  )
    throw new BaseError('User is not requesting to be friends');

  await userCollection.bulkWrite([
    {
      updateOne: {
        filter: { _id: userId },
        update: {
          $push: { friends: requestedUserId },
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
          $push: { friends: userId },
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
