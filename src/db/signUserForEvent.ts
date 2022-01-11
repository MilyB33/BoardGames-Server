import { ObjectId } from 'mongodb';
import MongoCustomClient from '../clients/mongoClient';
import BaseError from '../utils/Error';

import logging from '../config/logging';

const NAMESPACE = 'SignUserForEventDB';

import {
  EventsCollection,
  FullEvent,
  UserCollection,
} from '../models/models';

export default async function signUserForEvent(
  userID: string,
  eventID: string
): Promise<FullEvent> {
  logging.info(NAMESPACE, 'signUserForEvent');

  const db = await MongoCustomClient.connect();

  const eventsCollection = db.collection<EventsCollection>('Events');
  const usersCollection = db.collection<UserCollection>('Users');

  const user = await usersCollection.findOne(
    { _id: new ObjectId(userID) },
    { projection: { username: 1 } }
  );

  if (!user) throw new BaseError('User not found', 404);

  const event = await eventsCollection.findOne({
    _id: new ObjectId(eventID),
  });

  if (!event) throw new BaseError('Event not found', 404);

  if (event.createdBy._id === userID)
    throw new BaseError(
      'You can not sign up for your own event',
      400
    );

  if (event.signedUsers.includes(user)) {
    throw new BaseError('User already signed for this event', 400);
  }

  await eventsCollection.updateOne(
    { _id: new ObjectId(eventID) },
    { $push: { signedUsers: user } }
  );

  const updatedEvent = await eventsCollection.findOne({
    _id: new ObjectId(eventID),
  });

  if (!updatedEvent) throw new BaseError('Event not found', 404);

  return updatedEvent;
}
