import { ObjectId } from 'mongodb';
import MongoCustomClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'getUserEventDB';

import { EventsCollection, FullEvent } from '../models/models';

export default async function getUserEvent(
  userID: string,
  eventID: string
): Promise<FullEvent> {
  logging.debug(NAMESPACE, 'getUserEvent');

  const db = await MongoCustomClient.connect();

  const eventsCollection = db.collection<EventsCollection>('Events');

  const events = await eventsCollection.findOne({
    _id: new ObjectId(eventID),
    'createdBy._id': new ObjectId(userID),
  });

  if (!events) throw new Error('Event not found');

  return events;
}
