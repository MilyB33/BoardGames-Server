import { ObjectId } from 'mongodb';
import MongoCustomClient from '../clients/mongoClient';
import BaseError from '../utils/Error';

import {
  EventOptionally,
  EventsCollection,
  FullEvent,
} from '../models/models';

import logging from '../config/logging';

const NAMESPACE = 'updateEventDB';

export default async function updateEvent(
  userID: string,
  eventID: string,
  event: EventOptionally
): Promise<FullEvent> {
  logging.debug(NAMESPACE, 'updateEventDB');

  const db = await MongoCustomClient.connect();

  const collection = db.collection<EventsCollection>('Events');

  const foundEvent = await collection.findOne({
    _id: new ObjectId(eventID),
    'createdBy._id': new ObjectId(userID),
  });

  if (!foundEvent) throw new BaseError('Event not found', 404);

  await collection.updateOne(
    {
      _id: new ObjectId(eventID),
      'createdBy._id': new ObjectId(userID),
    },
    { $set: { ...event } }
  );

  const result = await collection.findOne({
    _id: new ObjectId(eventID),
    'createdBy._id': new ObjectId(userID),
  });

  if (!result) throw new BaseError('Event not found', 404);

  return result;
}
