import DBClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'getEventsAllDB';

import { FullEvent, PaginationQuery } from '../models/models';

export default async function getEventsAllDB(
  query: PaginationQuery
): Promise<FullEvent[]> {
  logging.debug(NAMESPACE, 'getEventsAllDB');

  const { offset, limit } = query;

  console.log(typeof query.offset);

  await DBClient.connect();

  const eventsCollection = DBClient.collection.Events();

  const events = await eventsCollection
    .find({})
    .skip(Number(offset) || 0)
    .limit(Number(limit) || 5)
    .toArray();

  return events;
}
