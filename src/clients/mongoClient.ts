import { MongoClient } from 'mongodb';

const URL =
  process.env.MONGODB_URI ||
  'mongodb+srv://admin:admin@cluster0.bdtla.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

class MongoCustomClient {
  private client: MongoClient = new MongoClient(URL);

  async connect(dbName: string = 'BoardGames') {
    await this.client.connect();

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
