import { MongoClient, Db } from 'mongodb';
import logging from '../config/logging';
import BaseError from '../utils/Error';

const URL =
  process.env.MONGODB_URI ||
  'mongodb+srv://admin:admin@cluster0.bdtla.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const NAMESPACE = 'Mongo Client';

class MongoCustomClient {
  private client: MongoClient = new MongoClient(URL);
  database!: Db;

  async connect(dbName: string = 'BoardGames') {
    await this.client.connect();

    logging.info(NAMESPACE, `Connected to MongoDB`);

    const db = this.client.db(dbName);

    if (!db) throw new BaseError('Database not found');

    this.database = db;

    logging.info(NAMESPACE, `Connected to DB`);

    return db;
  }

  close() {
    this.client.close();

    console.log('Disconnected from MongoDB');
  }
}

export default new MongoCustomClient();
