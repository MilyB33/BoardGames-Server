import MongoCustomClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'testingDB';

const testing = async () => {
  logging.info(NAMESPACE, 'Hello World');

  await MongoCustomClient.connect();
};

export default testing;
