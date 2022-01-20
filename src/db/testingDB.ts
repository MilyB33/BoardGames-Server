import { ObjectId } from 'mongodb';
import MongoCustomClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'testingDB';

import { sortUsersInOrder } from '../utils/helperFunctions';

import { UserEntry, User } from '../models/models';

const testing = async (body: any) => {
  logging.info(NAMESPACE, 'Hello World');

  const userID = new ObjectId('61e01ea02395c98cfd2cff0b');
  const friendID = new ObjectId('61e01f1f2395c98cfd3cff0c');

  await MongoCustomClient.connect();

  const collection = MongoCustomClient.collection.Users();

  const usersIDs = [new ObjectId(userID), new ObjectId(friendID)];

  await collection.updateOne(
    {
      _id: new ObjectId(userID),
    },
    { $set: { password: 'asfasfasaffafafafafaf' } }
  );
};

export default testing;
