import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'getUserSignedEvents';

import { FullEvent } from '../models/models';

export default async function getUserSignedEventsDB(
  userID: string
): Promise<FullEvent[]> {
  logging.info(NAMESPACE, 'getUserSignedEvents');

  await DBClient.connect();

  const eventsCollection = DBClient.collection.Events();

  const events = await eventsCollection
    .find({
      signedUsers: { $elemMatch: { _id: new ObjectId(userID) } },
      'createdBy._id': { $ne: new ObjectId(userID) },
    })
    .toArray();

  return events;
}
