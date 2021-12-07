import MongoCustomClient from '../clients/mongoClient';

import { Event } from '../models/models';
import logging from '../config/logging';

const NAMESPACE = 'addEventDB';

export default async function add(ownerId: string, Event: Event) {
  const db = await MongoCustomClient.connect();
  const collection = db.collection('Events');

  logging.debug(NAMESPACE, `check ${ownerId}`);

  await collection.insertOne({
    ...Event,
    createdBy: ownerId,
    createdAt: new Date().toISOString(),
  });
}