import MongoCustomClient from '../clients/mongoClient';
import bcrypt from 'bcrypt';
import BaseError from '../utils/Error';
import { Secrets } from '../models/models';

import logging from '../config/logging';

const NAMESPACE = 'registerDB';

export default async function register(secrets: Secrets) {
  logging.info(NAMESPACE, 'register');

  const { username, password } = secrets;

  const db = await MongoCustomClient.connect();

  const users = db.collection('Users');

  const searchExistingUser = await users.findOne({ username });
  if (searchExistingUser)
    throw new BaseError('User already exists', 400);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    ...secrets,
    password: hashedPassword,
  };

  await users.insertOne(user);
}
