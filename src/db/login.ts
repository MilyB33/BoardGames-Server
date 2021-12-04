import MongoCustomClient from '../clients/mongoClient';
import bcrypt from 'bcrypt';
import BaseError from '../utils/Error';
import { BaseErr, ErrorTypes } from '../utils/types';

import { Secrets } from '../utils/types';

export default async function login(secrets: Secrets) {
  try {
    const { username, password } = secrets;

    const db = await MongoCustomClient.connect();
    const collection = db.collection('Users');

    const user = await collection.findOne({ username });
    if (!user) throw new BaseError('User not found', 404);

    const { password: hashedPassword } = user;

    const isSame = await bcrypt.compare(password, hashedPassword);
    if (!isSame) throw new BaseError('Invalid password', 401);

    return {
      ...user,
      password: undefined,
    };
  } catch (error) {
    const { name } = error as Error;

    if (name === ErrorTypes.BaseError) {
      const { message, statusCode } = error as BaseErr;

      throw new BaseError(message, statusCode);
    }

    throw new BaseError(
      'Something went wrong during logging in',
      500
    );
  } finally {
    MongoCustomClient.close();
  }
}
