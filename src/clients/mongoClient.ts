import { MongoClient } from 'mongodb';
import logging from '../config/logging';

const URL =
  process.env.MONGODB_URI ||
  'mongodb+srv://admin:admin@cluster0.bdtla.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const NAMESPACE = 'Mongo Client';

class MongoCustomClient {
  private client: MongoClient = new MongoClient(URL);

  async connect(dbName: string = 'BoardGames') {
    await this.client.connect();

    logging.info(NAMESPACE, `Connected to MongoDB`);
    console.log('Connected to MongoDB');

    const db = this.client.db(dbName);

    console.log('Connected to Database');

    return db;
  }

  close() {
    this.client.close();

    console.log('Disconnected from MongoDB');
  }
}

export default new MongoCustomClient();
