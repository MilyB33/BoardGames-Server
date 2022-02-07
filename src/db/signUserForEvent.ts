import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import BaseError from '../utils/Error';
import mongoQueries from '../models/mongoAggregateQueries';

import logging from '../config/logging';

const NAMESPACE = 'SignUserForEventDB';

import { EventResult } from '../models/models';
import { mapUserEntries } from '../utils/helperFunctions';

export default async function signUserForEvent(
  userID: string,
  eventID: string
): Promise<EventResult> {
  logging.info(NAMESPACE, 'signUserForEvent');

  await DBClient.connect();

  const eventsCollection = DBClient.collection.Events();

  const userIDObject = new ObjectId(userID);
  const eventIDObject = new ObjectId(eventID);

  const event = await eventsCollection.findOneAndUpdate(
    { _id: eventIDObject },
    { $push: { signedUsers: userIDObject } },
    { returnDocument: 'before' }
  );

  if (!event.value) throw new BaseError('Event not found', 404);

  if (event.value.createdBy._id.toString() === userID)
    throw new BaseError(
      'You can not sign up for your own event',
      400
    );

  if (event.value.signedUsers.map(mapUserEntries).includes(userID)) {
    throw new BaseError('User already signed for this event', 400);
  }

  const updatedEvent = await eventsCollection
    .aggregate<EventResult>([
      { $match: { _id: eventIDObject } },
      mongoQueries.eventQuery.signedUsers,
    ])
    .next();

  if (!updatedEvent) throw new BaseError('Event not found', 404);

  return updatedEvent!;
}
