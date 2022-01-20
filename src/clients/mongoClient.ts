import { MongoClient, Db, Collection } from 'mongodb';
import logging from '../config/logging';
import BaseError from '../utils/Error';

import {
  CollectionsLiteral,
  CollectionsTypes,
} from '../models/models';

const URL =
  process.env.MONGODB_URI ||
  'mongodb+srv://admin:admin@cluster0.bdtla.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const NAMESPACE = 'Mongo Client';

class MongoCustomClient {
  client: MongoClient = new MongoClient(URL);
  database: Db | undefined;

  async connect(dbName: string = 'BoardGames') {
    await this.client.connect();

    logging.info(NAMESPACE, `Connected to MongoDB`);

    const db = this.client.db(dbName);

    if (!db) throw new BaseError('Database not found');

    this.database = db;

    logging.info(NAMESPACE, `Connected to DB`);

    return db;
  }

  collection = {
    Users: () =>
      this.database?.collection<CollectionsTypes['Users']>('Users'),
    Events: () =>
      this.database?.collection<CollectionsTypes['Events']>('Events'),
    Test: () =>
      this.database?.collection<CollectionsTypes['Test']>('Test'),
  } as CollectionsLiteral;

  close() {
    this.client.close();
    this.database = undefined; // I don't know if this is necessary

    console.log('Disconnected from MongoDB');
  }
}

export default new MongoCustomClient();
