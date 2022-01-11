import { ObjectId } from 'mongodb';
import MongoCustomClient from '../clients/mongoClient';

import logging from '../config/logging';
import BaseError from '../utils/Error';
import {
  Event,
  EventsCollection,
  UserCollection,
} from '../models/models';

const NAMESPACE = 'addEventDB';

export default async function add(
  ownerID: string,
  event: Event
): Promise<EventsCollection> {
  logging.debug(NAMESPACE, `check ${ownerID}`);

  const db = await MongoCustomClient.connect();

  const eventsCollection = db.collection<EventsCollection>('Events');
  const usersCollection = db.collection<UserCollection>('Users');

  const author = await usersCollection.findOne(
    { _id: new ObjectId(ownerID) },
    { projection: { username: 1 } }
  );

  if (!author) throw new BaseError('User not found', 404);

  const newEvent = {
    ...event,
    createdBy: author,
    createdAt: new Date().toISOString(),
    signedUsers: [author],
  };

  const _id = await eventsCollection
    .insertOne(newEvent)
    .then((result) => result.insertedId);

  return {
    ...newEvent,
    _id: _id,
  };
}
