import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import logging from '../config/logging';
import BaseError from '../utils/Error';

import { mapUserEntries } from '../utils/helperFunctions';

const NAMESPACE = 'rejectFriendsRequestDB';

export default async function rejectFriendsRequest(
  userID: string,
  friendID: string
) {
  logging.debug(NAMESPACE, 'rejectFriendsRequest');

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

  if (user.friends.map(mapUserEntries).includes(requestedUser._id))
    throw new BaseError('User already in friends list');

  if (
    user.friendsRequests.sent
      .map(mapUserEntries)
      .includes(requestedUser._id)
  )
    throw new BaseError('User is not requesting to be friends');

  if (
    user.friendsRequests.received
      .map(mapUserEntries)
      .includes(requestedUser._id)
  )
    throw new BaseError('User is not requesting to be friends');

  await userCollection.updateOne(
    { _id: new ObjectId(userID) },
    {
      $pull: {
        'friendsRequests.received': requestedUser,
      },
    }
  );

  await userCollection.updateOne(
    { _id: new ObjectId(friendID) },
    {
      $pull: {
        'friendsRequests.sent': {
          _id: new ObjectId(user._id),
          username: user.username,
        },
      },
    }
  );
}