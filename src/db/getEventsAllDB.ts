import MongoCustomClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'getEventsAllDB';

export default async function getEventsAllDB(query: any) {
  logging.debug(NAMESPACE, 'getEventsAllDB');

  const db = await MongoCustomClient.connect();

  const events = await db
    .collection('Events')
    .find({})
    .skip(Number(query.offset) || 0)
    .limit(Number(query.limit) || 5)
    .toArray();

  return events;
}
