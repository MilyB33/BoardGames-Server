import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import logging from '../config/logging';
import BaseError from '../utils/Error';

import { mapUserEntries } from '../utils/helperFunctions';

const NAMESPACE = 'deleteFriendDB';

export default async function deleteFriend(
  userID: string,
  friendID: string
) {
  logging.debug(NAMESPACE, 'deleteFriend');

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

  if (!requestedUser) throw new BaseError('User not found');

  // if (!user.friends.map(mapUserEntries).includes(requestedUser._id)) // check this
  //   throw new BaseError('User not in friends list');

  await userCollection.updateOne(
    { _id: new ObjectId(userID) },
    {
      $pull: {
        friends: requestedUser,
      },
    }
  );

  await userCollection.updateOne(
    { _id: new ObjectId(friendID) },
    {
      $pull: {
        friends: {
          _id: new ObjectId(userID),
          username: user.username,
        },
      },
    }
  );
}
