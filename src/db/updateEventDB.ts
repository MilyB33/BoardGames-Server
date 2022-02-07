import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import BaseError from '../utils/Error';
import mongoQueries from '../models/mongoAggregateQueries';

import { EventOptionally, EventResult } from '../models/models';

import logging from '../config/logging';

const NAMESPACE = 'updateEventDB';

export default async function updateEvent(
  userID: string,
  eventID: string,
  event: EventOptionally
): Promise<EventResult> {
  logging.debug(NAMESPACE, 'updateEventDB');

  await DBClient.connect();

  const collection = DBClient.collection.Events();

  const userIDObject = new ObjectId(userID);
  const eventIDObject = new ObjectId(eventID);

  const foundEvent = await collection.findOne({
    _id: eventIDObject,
    'createdBy._id': userIDObject,
  });

  if (!foundEvent) throw new BaseError('Event not found', 404);

  await collection.updateOne(
    {
      _id: eventIDObject,
      'createdBy._id': userIDObject,
    },
    { $set: { ...event } }
  );

  const updatedEvent = await collection
    .aggregate<EventResult>([
      { $match: { _id: eventIDObject } },
      mongoQueries.eventQuery.signedUsers,
      mongoQueries.eventQuery.invites,
    ])
    .next();

  if (!updatedEvent) throw new BaseError('Event not found', 404);

  return updatedEvent;
}
