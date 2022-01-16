import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'getUserEventDB';

import { FullEvent } from '../models/models';

export default async function getUserEvent(
  userID: string,
  eventID: string
): Promise<FullEvent> {
  logging.debug(NAMESPACE, 'getUserEvent');

  await DBClient.connect();

  const eventsCollection = DBClient.collection.Events();

  const events = await eventsCollection.findOne({
    _id: new ObjectId(eventID),
    'createdBy._id': new ObjectId(userID),
  });

  if (!events) throw new Error('Event not found');

  return events;
}
