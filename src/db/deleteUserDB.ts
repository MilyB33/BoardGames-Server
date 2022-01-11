import { ObjectId } from 'mongodb';
import logging from '../config/logging';
import MongoCustomClient from '../clients/mongoClient';

import { UserCollection, EventsCollection } from '../models/models';

const NAMESPACE = 'deleteUserEventDB';

export default async function deleteUserEvent(
  userID: string
): Promise<void> {
  logging.debug(NAMESPACE, ' deleteUserEvent');

  const db = await MongoCustomClient.connect();

  const eventsCollection = db.collection<EventsCollection>('Events');
  const usersCollection = db.collection<UserCollection>('Users');

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
