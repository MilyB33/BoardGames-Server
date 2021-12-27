import { ObjectId } from 'mongodb';
import MongoCustomClient from '../clients/mongoClient';

import { Event } from '../models/models';
import logging from '../config/logging';
import BaseError from '../utils/Error';

const NAMESPACE = 'addEventDB';

export default async function add(ownerID: string, event: Event) {
  const db = await MongoCustomClient.connect();
  const eventsCollection = db.collection('Events');
  const usersCollection = db.collection('Users');
  logging.debug(NAMESPACE, `check ${ownerID}`);

  const author = await usersCollection.findOne(
    {
      _id: new ObjectId(ownerID),
    },
    { projection: { username: 1 } }
  );

  if (!author) throw new BaseError('User not found', 404);

  const _id = await eventsCollection
    .insertOne({
      ...event,
      createdBy: author,
      createdAt: new Date().toISOString(),
      signedUsers: [author],
    })
    .then((result) => result.insertedId);

  const eventAdded = await eventsCollection.findOne({ _id });

  return eventAdded;
}
