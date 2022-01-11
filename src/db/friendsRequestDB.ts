import { ObjectId } from 'mongodb';
import MongoCustomClient from '../clients/mongoClient';
import BaseError from '../utils/Error';

// TODO: Rebuilding this file
export default async function AddContact(params: any, query: any) {
  const db = await MongoCustomClient.connect();

  const collection = await db.collection('Users');

  const user = await collection.findOne({
    _id: new ObjectId(params.userID),
  });

  if (!user) throw new BaseError('User not found', 404);

  const requestedUser = await collection.findOne({
    _id: new ObjectId(query.requestedUserID),
  });

  if (!requestedUser) throw new BaseError('User not found', 404);

  if (user.friends.includes(requestedUser._id))
    throw new BaseError('User already in friends', 400);

  if (
    user.friendsRequests.received.includes(requestedUser._id) ||
    user.friendsRequests.sent.includes(requestedUser._id)
  )
    throw new BaseError('Request already sent or received', 400);

  await collection.updateOne(
    { _id: new ObjectId(user._id) },
    {
      $push: {
        friendsRequests: {
          sent: requestedUser._id,
        },
      },
    }
  );

  user.friendsRequests.sent.push(requestedUser._id);

  await collection.updateOne(
    { _id: new ObjectId(requestedUser._id) },
    {
      $push: {
        friendsRequests: {
          received: user._id,
        },
      },
    }
  );

  return user;
}
