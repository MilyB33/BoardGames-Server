import { ObjectId } from 'mongodb';
import MongoClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'getUserSignedEvents';

export default async function getUserSignedEventsDB(userID: string) {
  logging.info(NAMESPACE, 'getUserSignedEvents');

  const db = await MongoClient.connect();

  const events = await db
    .collection('Events')
    .find({
      signedUsers: { $elemMatch: { _id: new ObjectId(userID) } },
      'createdBy._id': { $ne: new ObjectId(userID) },
    })
    .toArray();

  return events;
}
