import MongoCustomClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'getEventsAllDB';

import { EventsCollection, FullEvent } from '../models/models';

export default async function getEventsAllDB(
  query: any
): Promise<FullEvent[]> {
  logging.debug(NAMESPACE, 'getEventsAllDB');

  const db = await MongoCustomClient.connect();

  const eventsCollection = db.collection<EventsCollection>('Events');

  const events = await eventsCollection
    .find({})
    .skip(Number(query.offset) || 0)
    .limit(Number(query.limit) || 5)
    .toArray();

  return events;
}
