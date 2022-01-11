import MongoCustomClient from '../clients/mongoClient';
import logging from '../config/logging';

import { UserCollection } from '../models/models';

export default async function getUsers(
  query: any
): Promise<Omit<UserCollection, 'password'>[]> {
  logging.debug('getUsersDB', 'getUsers');

  const db = await MongoCustomClient.connect();

  const usersCollection = db.collection<UserCollection>('Users');

  const users = await usersCollection
    .find({}, { projection: { password: 0 } })
    .skip(Number(query.offset) || 0)
    .limit(Number(query.limit) || 5)
    .toArray();

  return users;
}
