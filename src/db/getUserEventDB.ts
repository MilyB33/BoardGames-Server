import { ObjectId } from 'mongodb';
import MongoCustomClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'getUserEventDB';

export default async function getUserEvent(
  userID: string,
  eventID: string
) {
  logging.debug(NAMESPACE, 'getUserEvent');

  const db = await MongoCustomClient.connect();

  const events = await db
    .collection('Events')
    .findOne({
      _id: new ObjectId(eventID),
      'createdBy._id': new ObjectId(userID),
    });

  return events;
}
