import { ObjectId } from 'mongodb';
import MongoClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'getUserSignedEvents';

import { EventsCollection, FullEvent } from '../models/models';

export default async function getUserSignedEventsDB(
  userID: string
): Promise<FullEvent[]> {
  logging.info(NAMESPACE, 'getUserSignedEvents');

  const db = await MongoClient.connect();

  const eventsCollection = db.collection<EventsCollection>('Events');

  const events = await eventsCollection
    .find({
      signedUsers: { $elemMatch: { _id: new ObjectId(userID) } },
      'createdBy._id': { $ne: new ObjectId(userID) },
    })
    .toArray();

  return events;
}
