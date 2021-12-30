import { ObjectId } from 'mongodb';
import MongoCustomClient from '../clients/mongoClient';
import BaseError from '../utils/Error';

import { EventOptionally } from '../models/models';
import logging from '../config/logging';

const NAMESPACE = 'updateEventDB';

export default async function updateEvent(
  userID: string,
  eventID: string,
  event: EventOptionally
) {
  logging.debug(NAMESPACE, 'updateEventDB');

  const db = await MongoCustomClient.connect();

  const foundEvent = await db.collection('Events').findOne({
    _id: new ObjectId(eventID),
    'createdBy._id': new ObjectId(userID),
  });

  if (!foundEvent) throw new BaseError('Event not found', 404);

  await db.collection('Events').updateOne(
    {
      _id: new ObjectId(eventID),
      'createdBy._id': new ObjectId(userID),
    },
    { $set: { ...event } }
  );

  const result = await db.collection('Events').findOne({
    _id: new ObjectId(eventID),
    'createdBy._id': new ObjectId(userID),
  });

  return result;
}
