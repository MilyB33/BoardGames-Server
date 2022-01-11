import { ObjectId } from 'mongodb';
import MongoCustomClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'getEventsUserAllDB';

import { EventsCollection, FullEvent } from '../models/models';

export default async function getEventsUserAll(
  userID: string
): Promise<FullEvent[]> {
  logging.debug(NAMESPACE, 'getEventsUserAll');

  const db = await MongoCustomClient.connect();

  const eventsCollection = db.collection<EventsCollection>('Events');

  const events = await eventsCollection
    .find({ 'createdBy._id': new ObjectId(userID) })
    .toArray();

  return events;
}
