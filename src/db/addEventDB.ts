import MongoCustomClient from '../clients/mongoClient';

import { Event } from '../models/models';
import logging from '../config/logging';

const NAMESPACE = 'addEventDB';

export default async function add(ownerID: string, event: Event) {
  const db = await MongoCustomClient.connect();
  const collection = db.collection('Events');

  logging.debug(NAMESPACE, `check ${ownerID}`);

  const _id = await collection
    .insertOne({
      ...event,
      createdBy: ownerID,
      createdAt: new Date().toISOString(),
      signedUsers: [ownerID],
    })
    .then((result) => result.insertedId);

  const eventAdded = await collection.findOne({ _id });

  return eventAdded;
}
