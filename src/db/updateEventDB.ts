import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import BaseError from '../utils/Error';

import { EventOptionally, FullEvent } from '../models/models';

import logging from '../config/logging';

const NAMESPACE = 'updateEventDB';

export default async function updateEvent(
  userID: string,
  eventID: string,
  event: EventOptionally
): Promise<FullEvent> {
  logging.debug(NAMESPACE, 'updateEventDB');

  await DBClient.connect();

  const collection = DBClient.collection.Events();

  const foundEvent = await collection.findOne({
    _id: new ObjectId(eventID),
    'createdBy._id': new ObjectId(userID),
  });

  if (!foundEvent) throw new BaseError('Event not found', 404);

  const result = await collection.findOneAndUpdate(
    {
      _id: new ObjectId(eventID),
      'createdBy._id': new ObjectId(userID),
    },
    { $set: { ...event } },
    { returnDocument: 'after' }
  );

  if (!result.value) throw new BaseError('Event not found', 404);

  return result.value;
}
