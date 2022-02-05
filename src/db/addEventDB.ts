import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import mongQueries from '../models/mongoAggregateQueries';

import logging from '../config/logging';
import BaseError from '../utils/Error';
import { Event, FullEvent } from '../models/models';

const NAMESPACE = 'addEventDB';

export default async function add(
  ownerID: string,
  event: Event
): Promise<FullEvent> {
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

  const returnedEvent = await eventsCollection
    .aggregate<FullEvent>([
      { $match: { _id: new ObjectId(_id) } },
      mongQueries.eventQuery.signedUsers,
      mongQueries.eventQuery.invites,
    ])
    .next();

  if (!returnedEvent) throw new BaseError('Event not found', 404);

  return returnedEvent;
}
