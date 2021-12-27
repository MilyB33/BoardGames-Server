import { ObjectId } from 'mongodb';
import MongoCustomClient from '../clients/mongoClient';
import BaseError from '../utils/Error';
import { FullEventDocument } from '../models/models';
import logging from '../config/logging';

const NAMESPACE = 'SignOutUserForEventDB';

export default async function signUserForEvent(
  userID: string,
  eventID: string
) {
  logging.info(NAMESPACE, 'signOutUserForEvent');

  const db = await MongoCustomClient.connect();

  const eventsCollection = db.collection('Events');
  const userCollection = db.collection('Users');

  const user = await userCollection.findOne(
    { _id: new ObjectId(userID) },
    { projection: { username: 1 } }
  );

  if (!user) throw new BaseError('User not found', 404);

  const event = await eventsCollection.findOne<FullEventDocument>({
    _id: new ObjectId(eventID),
  });

  if (!event) throw new BaseError('Event not found', 404);

  if (event.createdBy._id === userID.toString())
    throw new BaseError(
      'You can not sign out for your own event',
      400
    );

  if (
    !event.signedUsers
      .map((user) => user._id.toString())
      .includes(userID)
  )
    throw new BaseError('User not signed for this event', 400);

  await eventsCollection.updateOne(
    { _id: new ObjectId(eventID) },
    { $pull: { signedUsers: user } }
  );

  const updatedEvent = await eventsCollection.findOne({
    _id: new ObjectId(eventID),
  });

  return updatedEvent;
}
