import DBClient from '../clients/mongoClient';
import { ObjectId } from 'mongodb';
import logging from '../config/logging';

const NAMESPACE = 'deleteUserEventDB';

export default async function deleteUserEvent(
  userID: string,
  eventID: string
): Promise<void> {
  logging.debug(NAMESPACE, ' deleteUserEvent');

  await DBClient.connect();

  const eventsCollection = DBClient.collection.Events();

  await eventsCollection.deleteOne({
    _id: new ObjectId(eventID),
    'createdBy._id': new ObjectId(userID),
  });
}
