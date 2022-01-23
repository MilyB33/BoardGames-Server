import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';

import logging from '../config/logging';
import BaseError from '../utils/Error';
import { Event, EventsCollection } from '../models/models';

const NAMESPACE = 'addEventDB';

export default async function add(
  ownerID: string,
  event: Event
): Promise<EventsCollection> {
  logging.debug(NAMESPACE, `check ${ownerID}`);

  await DBClient.connect();

  const eventsCollection = DBClient.collection.Events();
  const usersCollection = DBClient.collection.Users();

  const author = await usersCollection.findOne(
    { _id: new ObjectId(ownerID) },
    { projection: { username: 1 } }
  );

  if (!author) throw new BaseError('User not found', 404);

  const newEvent = {
    ...event,
    createdBy: author,
    createdAt: new Date().toISOString(),
    signedUsers: [author._id],
    invites: [],
  };

  const _id = await eventsCollection
    .insertOne(newEvent)
    .then((result) => result.insertedId);

  return {
    ...newEvent,
    _id: _id,
  };
}
