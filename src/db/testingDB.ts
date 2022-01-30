import { ObjectId } from 'mongodb';
import MongoCustomClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'testingDB';

import { sortUsersInOrder } from '../utils/helperFunctions';

import { UserEntry, User, FullEvent } from '../models/models';

const testing = async (body: any) => {
  logging.info(NAMESPACE, 'Hello World');

  const userID = new ObjectId('61f6cfc922d94b991689aef5');
  const friendID = new ObjectId('61e01f1f2395c98cfd3cff0c');
  const inviteId = new ObjectId('61eab344ccc442d640c17fe4');

  const limit = '10';
  const offset = '0';

  await MongoCustomClient.connect();

  const userCollection = MongoCustomClient.collection.Users();
  const eventInvitesCollection =
    MongoCustomClient.collection.EventInvites();
  const eventsCollection = MongoCustomClient.collection.Events();
  const testingCollection = MongoCustomClient.collection.Test();

  // const eventRequests = await userCollection
  //   .aggregate([
  //     {
  //       $match: {
  //         _id: userID,
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 0,
  //         eventRequests: {
  //           $concatArrays: [
  //             '$eventsRequests.sent',
  //             '$eventsRequests.received',
  //           ],
  //         },
  //       },
  //     },
  //   ])
  //   .next();

  const users = await userCollection
    .aggregate([
      {
        $match: {
          $or: [
            {
              'eventsRequests.sent': {
                $in: [new ObjectId('61f700b8a5ad47ffd9c8ca0a')],
              },
            },
            {
              'eventsRequests.received': {
                $in: [new ObjectId('61f700b8a5ad47ffd9c8ca0a')],
              },
            },
          ],
        },
      },
    ])
    .toArray();

  console.log(users);

  // const invite = await cursor.next();

  return users;
};

export default testing;
