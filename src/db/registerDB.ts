import DBClient from '../clients/mongoClient';
import bcrypt from 'bcrypt';
import BaseError from '../utils/Error';
import { Secrets } from '../models/models';

import logging from '../config/logging';

const NAMESPACE = 'registerDB';

export default async function register(
  secrets: Secrets
): Promise<void> {
  logging.info(NAMESPACE, 'register');

  const { username, password } = secrets;

  await DBClient.connect();

  const collection = DBClient.collection.Users();

  const searchExistingUser = await collection.findOne({ username });

  if (searchExistingUser)
    throw new BaseError('User already exists', 400);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    ...secrets,
    password: hashedPassword,
    friends: [],
    friendsRequests: {
      sent: [],
      received: [],
    },
    eventsRequests: {
      sent: [],
      received: [],
    },
  };

  await collection.insertOne(user);
}
