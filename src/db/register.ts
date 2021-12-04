import MongoCustomClient from '../clients/mongoClient';
import bcrypt from 'bcrypt';
import BaseError from '../utils/Error';
import { BaseErr, ErrorTypes, Secrets } from '../utils/types';

export default async function register(secrets: Secrets) {
  try {
    const { username, password } = secrets;

    if (!username) throw new BaseError('Username is required', 400);
    if (!password) throw new BaseError('Password is required', 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      ...secrets,
      password: hashedPassword,
    };

    const db = await MongoCustomClient.connect();

    const users = db.collection('Users');

    const searchExistingUser = await users.findOne({ username });
    if (searchExistingUser)
      throw new BaseError('User already exists', 400);

    await users.insertOne(user);
  } catch (error) {
    const { name } = error as Error;

    if (name === ErrorTypes.BaseError) {
      const { message, statusCode } = error as BaseErr;

      throw new BaseError(message, statusCode);
    }

    throw new BaseError(
      'Something went wrong during registering',
      500
    );
  } finally {
    MongoCustomClient.close();
  }
}
