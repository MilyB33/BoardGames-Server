import MongoCustomClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'getEventsAllDB';

export default async function getEventsAllDB() {
  logging.debug(NAMESPACE, 'getEventsAllDB');

  const db = await MongoCustomClient.connect();

  const events = await db.collection('Events').find({}).toArray();

  return events;
}
