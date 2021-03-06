import DBClient from '../clients/mongoClient';
import bcrypt from 'bcrypt';

import jwt, { Secret } from 'jsonwebtoken';
import BaseError from '../utils/Error';
import { Secrets, LoginData, DecodedToken } from '../models/models';
import { typeGuard } from '../utils/helperFunctions';

import logging from '../config/logging';

const NAMESPACE = 'loginDB';

type Body = DecodedToken | Secrets;

export default async function login(body: Body): Promise<LoginData> {
  logging.info(NAMESPACE, 'login');

  let token = '';

  const username = body.username;

  await DBClient.connect();

  const collection = DBClient.collection.Users();

  const user = await collection.findOne(
    {
      username,
    },
    {
      projection: {
        _id: 1,
        username: 1,
        password: 1,
      },
    }
  );

  if (!user) throw new BaseError('User not found', 404);

  const { password: hashedPassword, ...restData } = user;

  if (!typeGuard<Body, DecodedToken>(body, 'token')) {
    const { password } = body;

    const isSame = await bcrypt.compare(password, hashedPassword);

    if (!isSame) throw new BaseError('Invalid password', 401);

    token = jwt.sign(
      { username, id: user._id },
      process.env.JWT_SECRET as Secret
      // { expiresIn: '1h' } For now we don't need to expire the token
    );
  } else token = body.token;

  return {
    ...restData,
    token,
  };
}
