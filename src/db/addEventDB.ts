import { ObjectId, ReturnDocument } from 'mongodb';
import DBClient from '../clients/mongoClient';

import logging from '../config/logging';
import BaseError from '../utils/Error';
import { Event, EventsCollection, FullEvent } from '../models/models';

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

  // User Projection
  const userProjection = {
    $project: {
      _id: 1,
      username: 1,
    },
  };

  //concat invites with events
  const invites = {
    $lookup: {
      from: 'EventInvites',
      let: { eventId: '$_eventId' },
      pipeline: [
        { $match: { $expr: { $eq: ['$eventID', '$$eventId'] } } },
        {
          $lookup: {
            from: 'Users',
            let: { userId: '$users.received' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
              userProjection,
            ],
            as: 'users.received',
          },
        },
        {
          $project: {
            _id: 1,
            user: { $arrayElemAt: ['$users.received', 0] },
          },
        },
      ],
      as: 'invites',
    },
  };

  const userEventsOptions = {
    $lookup: {
      from: 'Users',
      let: { signedUsers: '$signedUsers' },
      pipeline: [
        {
          $match: {
            $expr: {
              $in: ['$_id', '$$signedUsers'],
            },
          },
        },
        {
          $project: {
            _id: 1,
            username: 1,
          },
        },
      ],
      as: 'signedUsers',
    },
  };

  const returnedEvent = await eventsCollection
    .aggregate<FullEvent>([
      { $match: { _id: new ObjectId(_id) } },
      userEventsOptions,
      invites,
    ])
    .next();

  if (!returnedEvent) throw new BaseError('Event not found', 404);

  return returnedEvent;
}
