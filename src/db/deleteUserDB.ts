import { ObjectId } from 'mongodb';
import logging from '../config/logging';
import MongoCustomClient from '../clients/mongoClient';

const NAMESPACE = 'deleteUserEventDB';

export default async function deleteUserEvent(userID: string) {
  logging.debug(NAMESPACE, ' deleteUserEvent');

  const db = await MongoCustomClient.connect();

  await db.collection('Users').deleteOne({
    _id: new ObjectId(userID),
  });

  await db.collection('Events').deleteMany({
    'createdBy._id': new ObjectId(userID),
  });

  await db.collection('Events').updateMany(
    { signedUsers: { $elemMatch: { _id: new ObjectId(userID) } } },
    {
      // @ts-ignore - MongoDB driver doesn't support $pull
      $pull: {
        signedUsers: { _id: new ObjectId(userID) },
      },
    }
  );
}
