import DBClient from '../clients/mongoClient';
import mongoQueries from '../models/mongoAggregateQueries';

import logging from '../config/logging';

const NAMESPACE = 'getEventsAllDB';

import { FullEvent, PaginationQuery } from '../models/models';

export default async function getEventsAllDB(
  query: PaginationQuery
): Promise<FullEvent[]> {
  logging.debug(NAMESPACE, 'getEventsAllDB');

  const { offset, limit } = query;

  await DBClient.connect();

  const eventsCollection = DBClient.collection.Events();

  const events = await eventsCollection
    .aggregate<FullEvent>([
      { $match: { isPrivate: false } },
      { $skip: offset ? parseInt(offset) : 0 },
      { $limit: limit ? parseInt(limit) : 0 },
      mongoQueries.eventQuery.signedUsers,
      ...mongoQueries.eventQuery.invitesWithoutInfo,
    ])
    .toArray();

  return events;
}
