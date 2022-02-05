import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import mongoQueries from '../models/mongoAggregateQueries';

import logging from '../config/logging';

const NAMESPACE = 'getEventsUserAllDB';

import { FullEvent, PaginationQuery } from '../models/models';

export default async function getEventsUserAll(
  userID: string,
  query: PaginationQuery
): Promise<FullEvent[]> {
  logging.debug(NAMESPACE, 'getEventsUserAll');

  const { offset, limit } = query;

  await DBClient.connect();

  const eventsCollection = DBClient.collection.Events();

  const events = await eventsCollection
    .aggregate<FullEvent>([
      { $match: { $expr: { $eq: ['$createdBy._id', userID] } } },
      { $skip: offset ? parseInt(offset) : 0 },
      { $limit: limit ? parseInt(limit) : 0 },
      mongoQueries.eventQuery.signedUsers,
      mongoQueries.eventQuery.invites,
    ])
    .toArray();

  return events;
}
