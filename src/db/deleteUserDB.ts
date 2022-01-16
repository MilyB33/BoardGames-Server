import { ObjectId } from 'mongodb';
import logging from '../config/logging';
import DBClient from '../clients/mongoClient';

const NAMESPACE = 'deleteUserEventDB';

export default async function deleteUserEvent(
  userID: string
): Promise<void> {
  logging.debug(NAMESPACE, ' deleteUserEvent');

  await DBClient.connect();

  const eventsCollection = DBClient.collection.Events();
  const usersCollection = DBClient.collection.Users();

  await usersCollection.deleteOne({
    _id: new ObjectId(userID),
  });

  await eventsCollection.deleteMany({
    'createdBy._id': new ObjectId(userID),
  });

  await eventsCollection.updateMany(
    { signedUsers: { $elemMatch: { _id: new ObjectId(userID) } } },
    {
      $pull: {
        signedUsers: { _id: new ObjectId(userID) },
      },
    }
  );
}
