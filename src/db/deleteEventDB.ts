import { ObjectId } from 'bson';
import MongoCustomClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'DeleteEventDB';

export default async function deleteEvent(
  userID: string,
  eventID: string
) {
  logging.debug(NAMESPACE, 'DeleteEventDB');

  const db = await MongoCustomClient.connect();

  await db
    .collection('Events')
    .deleteOne({ _id: new ObjectId(eventID), createdBy: userID });
}
