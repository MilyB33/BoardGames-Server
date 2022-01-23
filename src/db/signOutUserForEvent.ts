import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import BaseError from '../utils/Error';
import { FullEvent } from '../models/models';
import logging from '../config/logging';

const NAMESPACE = 'SignOutUserForEventDB';

export default async function signUserForEvent(
  userID: string,
  eventID: string
): Promise<FullEvent> {
  logging.info(NAMESPACE, 'signOutUserForEvent');

  await DBClient.connect();

  const eventsCollection = DBClient.collection.Events();
  const userCollection = DBClient.collection.Users();

  const user = await userCollection.findOne(
    { _id: new ObjectId(userID) },
    { projection: { _id: 1 } }
  );

  if (!user) throw new BaseError('User not found', 404);

  const event = await eventsCollection.findOne({
    _id: new ObjectId(eventID),
  });

  if (!event) throw new BaseError('Event not found', 404);

  if (event.createdBy._id === userID.toString())
    throw new BaseError(
      'You can not sign out for your own event',
      400
    );

  if (
    !event.signedUsers.map((user) => user.toString()).includes(userID)
  )
    throw new BaseError('User not signed for this event', 400);

  let updatedEvent = await eventsCollection.findOneAndUpdate(
    { _id: new ObjectId(eventID) },
    { $pull: { signedUsers: user._id } },
    { returnDocument: 'after' }
  );

  if (!updatedEvent.value)
    throw new BaseError('Event not found', 404);

  return updatedEvent.value;
}
