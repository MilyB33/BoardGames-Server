import { ObjectId } from 'mongodb';
import MongoCustomClient from '../clients/mongoClient';
import logging from '../config/logging';

import { EventsCollection } from '../models/models';

const NAMESPACE = 'DeleteEventDB';

export default async function deleteEvent(
  userID: string,
  eventID: string
): Promise<void> {
  logging.debug(NAMESPACE, 'DeleteEventDB');

  const db = await MongoCustomClient.connect();

  const eventsCollection = db.collection<EventsCollection>('Events');

  await eventsCollection.deleteOne({
    _id: new ObjectId(eventID),
    'createdBy._id': new ObjectId(userID),
  });
}
