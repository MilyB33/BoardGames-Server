import DBClient from '../clients/mongoClient';
import mongoQueries from '../models/mongoAggregateQueries';

import logging from '../config/logging';

const NAMESPACE = 'getEventsUserAllDB';

import { EventResult, PaginationQuery } from '../models/models';

export default async function getEventsUserAll(
  userID: string,
  query: PaginationQuery
): Promise<EventResult[]> {
  logging.debug(NAMESPACE, 'getEventsUserAll');

  const { offset, limit } = query;

  await DBClient.connect();

  const eventsCollection = DBClient.collection.Events();

  const events = await eventsCollection
    .aggregate<EventResult>([
      { $match: { $expr: { $eq: ['$createdBy._id', userID] } } },
      { $skip: offset ? parseInt(offset) : 0 },
      { $limit: limit ? parseInt(limit) : 0 },
      mongoQueries.eventQuery.signedUsers,
      mongoQueries.eventQuery.invites,
    ])
    .toArray();

  return events;
}
