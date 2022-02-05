import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import BaseError from '../utils/Error';
import mongoQueries from '../models/mongoAggregateQueries';

import logging from '../config/logging';

const NAMESPACE = 'SignUserForEventDB';

import { FullEvent } from '../models/models';

export default async function signUserForEvent(
  userID: string,
  eventID: string
): Promise<FullEvent> {
  logging.info(NAMESPACE, 'signUserForEvent');

  await DBClient.connect();

  const eventsCollection = DBClient.collection.Events();

  const event = await eventsCollection.findOneAndUpdate(
    { _id: new ObjectId(eventID) },
    { $push: { signedUsers: new ObjectId(userID) } },
    { returnDocument: 'before' }
  );

  if (!event.value) throw new BaseError('Event not found', 404);

  if (event.value.createdBy._id === userID)
    throw new BaseError(
      'You can not sign up for your own event',
      400
    );

  if (event.value.signedUsers.includes(userID)) {
    throw new BaseError('User already signed for this event', 400);
  }

  const updatedEvent = await eventsCollection
    .aggregate<FullEvent>([
      { $match: { _id: new ObjectId(eventID) } },
      mongoQueries.eventQuery.signedUsers,
    ])
    .next();

  console.log(updatedEvent);

  return updatedEvent!;
}
