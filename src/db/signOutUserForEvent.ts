import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import BaseError from '../utils/Error';
import { EventResult } from '../models/models';
import logging from '../config/logging';
import mongoQueries from '../models/mongoAggregateQueries';
import { mapUserEntries } from '../utils/helperFunctions';

const NAMESPACE = 'SignOutUserForEventDB';

export default async function signUserForEvent(
  userID: string,
  eventID: string
): Promise<EventResult> {
  logging.info(NAMESPACE, 'signOutUserForEvent');

  await DBClient.connect();

  const eventsCollection = DBClient.collection.Events();
  const userCollection = DBClient.collection.Users();

  const userIDObject = new ObjectId(userID);
  const eventIDObject = new ObjectId(eventID);

  const user = await userCollection.findOne(
    { _id: userIDObject },
    { projection: { _id: 1 } }
  );

  if (!user) throw new BaseError('User not found', 404);

  const event = await eventsCollection.findOne({
    _id: eventIDObject,
  });

  if (!event) throw new BaseError('Event not found', 404);

  if (event.createdBy._id.toString() === userID)
    throw new BaseError(
      'You can not sign out for your own event',
      400
    );

  if (!event.signedUsers.map(mapUserEntries).includes(userID))
    throw new BaseError('User not signed for this event', 400);

  await eventsCollection.updateOne(
    { _id: eventIDObject },
    { $pull: { signedUsers: userIDObject } }
  );

  const updatedEvent = await eventsCollection
    .aggregate<EventResult>([
      { $match: { _id: eventIDObject } },
      mongoQueries.eventQuery.signedUsers,
      mongoQueries.eventQuery.invites,
    ])
    .next();

  if (!updatedEvent) throw new BaseError('Event not found', 404);

  return updatedEvent;
}
