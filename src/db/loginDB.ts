import MongoCustomClient from '../clients/mongoClient';
import bcrypt from 'bcrypt';

import jwt, { Secret } from 'jsonwebtoken';
import BaseError from '../utils/Error';
import { Secrets, User, UserCollection } from '../models/models';

import logging from '../config/logging';

const NAMESPACE = 'loginDB';

export default async function login(secrets: Secrets): Promise<User> {
  logging.info(NAMESPACE, 'login');

  const { username, password } = secrets;

  const db = await MongoCustomClient.connect();
  const collection = db.collection<UserCollection>('Users');

  const user = await collection.findOne({ username });
  if (!user) throw new BaseError('User not found', 404);

  const { password: hashedPassword } = user;

  const isSame = await bcrypt.compare(password, hashedPassword);
  if (!isSame) throw new BaseError('Invalid password', 401);

  const token = jwt.sign(
    { username, id: user._id },
    process.env.JWT_SECRET as Secret
    // { expiresIn: '1h' } For now we don't need to expire the token
  );

  return {
    ...user,
    token,
  };
}
