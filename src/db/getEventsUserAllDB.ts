import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'getEventsUserAllDB';

import { FullEvent } from '../models/models';

export default async function getEventsUserAll(
  userID: string
): Promise<FullEvent[]> {
  logging.debug(NAMESPACE, 'getEventsUserAll');

  await DBClient.connect();

  const eventsCollection = DBClient.collection.Events();

  const events = await eventsCollection
    .find({ 'createdBy._id': new ObjectId(userID) })
    .toArray();

  return events;
}
