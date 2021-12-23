import { ObjectId } from 'mongodb';
import MongoCustomClient from '../clients/mongoClient';
import BaseError from '../utils/Error';

import logging from '../config/logging';

const NAMESPACE = 'SignUserForEventDB';

export default async function signUserForEvent(
  userID: string,
  eventID: string
) {
  logging.info(NAMESPACE, 'signUserForEvent');

  const db = await MongoCustomClient.connect();

  const events = db.collection('Events');

  const event = await events.findOne({ _id: new ObjectId(eventID) });

  if (!event) throw new BaseError('Event not found', 404);

  if (event.createdBy === userID)
    throw new BaseError(
      'You can not sign up for your own event',
      400
    );

  if (event.signedUsers.includes(userID)) {
    throw new BaseError('User already signed for this event', 400);
  }

  await events.updateOne(
    { _id: new ObjectId(eventID) },
    { $push: { signedUsers: userID } }
  );

  const updatedEvent = await events.findOne({
    _id: new ObjectId(eventID),
  });

  return updatedEvent;
}
