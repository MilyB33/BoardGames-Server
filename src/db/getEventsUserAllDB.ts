import { ObjectId } from 'mongodb';
import MongoCustomClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'getEventsUserAllDB';

export default async function getEventsUserAll(userID: string) {
  logging.debug(NAMESPACE, 'getEventsUserAll');

  const db = await MongoCustomClient.connect();

  const events = await db
    .collection('Events')
    .find({ 'createdBy._id': new ObjectId(userID) })
    .toArray();

  console.log(events);

  return events;
}
