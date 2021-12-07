import MongoCustomClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'getEventsAllDB';

export default async function getEventsUserAll(userID: string) {
  logging.debug(NAMESPACE, 'getEventsAllDB');

  const db = await MongoCustomClient.connect();

  const events = await db
    .collection('Events')
    .find({ createdBy: userID })
    .toArray();

  return events;
}
