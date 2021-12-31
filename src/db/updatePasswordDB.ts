import { ObjectId } from 'mongodb';
import MongoCustomClient from '../clients/mongoClient';
import BaseError from '../utils/Error';
import bcrypt from 'bcrypt';

export default async function updatePasswordDB(
  userID: string,
  body: {
    data: {
      oldPassword: string;
      newPassword: string;
    };
  }
) {
  const { newPassword, oldPassword } = body.data;

  if (!newPassword || !oldPassword)
    throw new BaseError(
      'newPassword and oldPassword are required in body',
      400
    );

  const db = await MongoCustomClient.connect();

  const foundUser = await db.collection('Users').findOne({
    _id: new ObjectId(userID),
  });

  // Remember to done this in the future

  if (!foundUser) throw new BaseError('User not found', 404);

  const { password: hashedPassword } = foundUser;

  if (newPassword === oldPassword)
    throw new BaseError(
      'New password is the same as old password',
      400
    );

  const isSame = await bcrypt.compare(oldPassword, hashedPassword);

  if (!isSame) throw new BaseError('Invalid password', 401);

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await db.collection('Users').updateOne(
    {
      _id: new ObjectId(userID),
    },
    { $set: { password: hashedNewPassword } }
  );
}
