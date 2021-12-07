import MongoCustomClient from '../clients/mongoClient';
import bcrypt from 'bcrypt';

import jwt, { Secret } from 'jsonwebtoken';
import BaseError from '../utils/Error';
import { Secrets } from '../models/models';

import logging from '../config/logging';

import dotenv from 'dotenv';

dotenv.config();

const NAMESPACE = 'loginDB';

export default async function login(secrets: Secrets) {
  logging.info(NAMESPACE, 'login');

  const { username, password } = secrets;

  const db = await MongoCustomClient.connect();
  const collection = db.collection('Users');

  const user = await collection.findOne({ username });
  if (!user) throw new BaseError('User not found', 404);

  const { password: hashedPassword } = user;

  const isSame = await bcrypt.compare(password, hashedPassword);
  if (!isSame) throw new BaseError('Invalid password', 401);

  const token = jwt.sign(
    { username, id: user._id },
    process.env.JWT_SECRET as Secret
  );

  return {
    ...user,
    password: undefined,
    token,
  };
}
