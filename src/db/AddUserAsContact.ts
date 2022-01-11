import { ObjectId } from 'mongodb';
import MongoCustomClient from '../clients/mongoClient';
import logging from '../config/logging';
import BaseError from '../utils/Error';

export default async function AddContact(params: any, query: any) {
  logging.debug('getUsersDB', 'getUsers');

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

  if (user.friends.inludes(requestedUser._id))
    throw new BaseError('User already in friends', 400);

  // dokonczyc
}
