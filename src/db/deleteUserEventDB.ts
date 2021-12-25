import MongoCustomClient from '../clients/mongoClient';
import { ObjectId } from 'mongodb';
import logging from '../config/logging';

const NAMESPACE = 'deleteUserEventDB';

export default async function deleteUserEvent(
  userID: string,
  eventID: string
) {
  logging.debug(NAMESPACE, ' deleteUserEvent');
  const db = await MongoCustomClient.connect();

  await db.collection('Events').deleteOne({
    _id: new ObjectId(eventID),
    createdBy: new ObjectId(userID),
  });
}
