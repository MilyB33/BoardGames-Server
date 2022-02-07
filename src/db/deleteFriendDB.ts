import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import logging from '../config/logging';
import BaseError from '../utils/Error';
import mongoQueries from '../models/mongoAggregateQueries';

import {
  mapUserEntries,
  sortUsersInOrder,
  mapIds,
} from '../utils/helperFunctions';

import { UserResult } from '../models/models';

const NAMESPACE = 'deleteFriendDB';

export default async function deleteFriend(
  userID: string,
  friendID: string
): Promise<void> {
  logging.debug(NAMESPACE, 'deleteFriend');

  await DBClient.connect();

  const userCollection = DBClient.collection.Users();

  const userIDs = [userID, friendID].map(mapIds);

  const usersResult = await userCollection
    .aggregate<UserResult>([
      { $match: { _id: { $in: userIDs } } },
      mongoQueries.userQuery.userEntryWithFriends(userID),
    ])
    .toArray();

  const users = sortUsersInOrder<UserResult>(usersResult, userIDs);

  if (!users[0] || !users[1]) throw new BaseError('User not found');

  const userId = users[0]._id;
  const friendId = users[1]._id;

  if (
    !users[0].friends
      .map(mapUserEntries)
      .includes(friendId.toString())
  )
    throw new BaseError('User not in friends list');

  await userCollection.bulkWrite([
    {
      updateOne: {
        filter: { _id: userId },
        update: { $pull: { friends: friendId } },
      },
    },
    {
      updateOne: {
        filter: { _id: friendId },
        update: { $pull: { friends: userId } },
      },
    },
  ]);
}
