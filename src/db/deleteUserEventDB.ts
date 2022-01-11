import MongoCustomClient from '../clients/mongoClient';
import { ObjectId } from 'mongodb';
import logging from '../config/logging';

const NAMESPACE = 'deleteUserEventDB';

import { EventsCollection } from '../models/models';

export default async function deleteUserEvent(
  userID: string,
  eventID: string
): Promise<void> {
  logging.debug(NAMESPACE, ' deleteUserEvent');

  const db = await MongoCustomClient.connect();

  const eventsCollection = db.collection<EventsCollection>('Events');

  await eventsCollection.deleteOne({
    _id: new ObjectId(eventID),
    'createdBy._id': new ObjectId(userID),
  });
}
