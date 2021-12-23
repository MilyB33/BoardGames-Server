import MongoClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'getUserSignedEvents';

export default async function getUserSignedEventsDB(userId: string) {
  logging.info(NAMESPACE, 'getUserSignedEvents');

  const db = await MongoClient.connect();

  const events = await db
    .collection('Events')
    .find({ signedUsers: userId, createdBy: { $ne: userId } })
    .toArray();

  return events;
}
