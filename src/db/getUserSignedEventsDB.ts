import MongoClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'getUserSignedEvents';

export default async function getUserSignedEventsDB(userID: string) {
  logging.info(NAMESPACE, 'getUserSignedEvents');

  const db = await MongoClient.connect();

  const events = await db
    .collection('Events')
    .find({ signedUsers: userID, createdBy: { $ne: userID } })
    .toArray();

  return events;
}
