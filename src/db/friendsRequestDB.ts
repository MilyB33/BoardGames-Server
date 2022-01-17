import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import BaseError from '../utils/Error';
import { mapUserEntries } from '../utils/helperFunctions';

import { UserEntry } from '../models/models';

// TODO: Rebuilding this file
export default async function AddContact(
  userID: string,
  friendID: string
) {
  await DBClient.connect();

  const userCollection = DBClient.collection.Users();

  const user = await userCollection.findOne({
    _id: new ObjectId(userID),
  });

  if (!user) throw new BaseError('User not found');

  const requestedUser = await userCollection.findOne(
    {
      _id: new ObjectId(friendID),
    },
    { projection: { _id: 1, username: 1 } }
  );

  if (!requestedUser) throw new BaseError('Requested User not found');

  const userId = new ObjectId(userID);
  const requestedUserId = new ObjectId(friendID);

  if (user.friends.map(mapUserEntries).includes(requestedUserId))
    throw new BaseError('User already in friends list');

  if (
    user.friendsRequests.sent
      .map(mapUserEntries)
      .includes(requestedUserId)
  )
    throw new BaseError('User already requested to be friends');

  if (
    user.friendsRequests.received
      .map(mapUserEntries)
      .includes(requestedUserId)
  )
    throw new BaseError('User already requested to be friends');

  await userCollection.updateOne(
    { _id: new ObjectId(userId) },
    {
      $push: {
        'friendsRequests.sent': requestedUser,
      },
    }
  );

  await userCollection.updateOne(
    { _id: new ObjectId(requestedUserId) },
    {
      $push: {
        'friendsRequests.received': {
          _id: userId,
          username: user.username,
        },
      },
    }
  );

  return {
    _id: requestedUser._id,
    username: requestedUser.username,
  } as UserEntry;
}
