import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'DeleteEventDB';

export default async function deleteEvent(
  userID: string,
  eventID: string
): Promise<void> {
  logging.debug(NAMESPACE, 'DeleteEventDB');

  await DBClient.connect();

  const eventsCollection = DBClient.collection.Events();

  await eventsCollection.deleteOne({
    _id: new ObjectId(eventID),
    'createdBy._id': new ObjectId(userID),
  });
}
