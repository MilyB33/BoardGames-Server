import { ObjectId } from 'mongodb';
import MongoCustomClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'testingDB';

import { sortUsersInOrder } from '../utils/helperFunctions';

import { UserEntry, User, FullEvent } from '../models/models';

const testing = async (body: any) => {
  logging.info(NAMESPACE, 'Hello World');

  const userID = new ObjectId('61e01ea02395c98cfd3cff0b');
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

  // const invite = await eventInvitesCollection.findOne({
  //   _id: new ObjectId(inviteId),
  // });

  // aggregate
  // const cursor = eventsCollection.aggregate([
  //   { $limit: 1 },
  // { $match: { username: 'trzeci' } },
  // userEventsOptions,
  // signedEventsOptions,
  // invitedEventsOptions,
  // friendsOptions,
  // ...friendsRequestsOptions,
  // {
  //   $project: {
  //     _id: 0,
  //     friends: 1,
  //     friendsRequests: 1,
  //     eventsRequests: 1,
  //     events: {
  //       userEvents: 1,
  //       userSignedEvents: 1,
  //       userInvitedEvents: '$events.userInvitedEvents.event',
  //     },
  //   },
  // },
  // ]);

  // await testingCollection.insertOne({
  //   town: 'Warsaw',
  //   country: 'Poland',
  //   population: '3000000',
  //   street: 'Krakowska',
  //   number: '1',
  //   zip: '00-001',
  //   coordinates: {
  //     lat: '52.2323',
  //     lng: '21.1232',
  //   },
  // });

  // await testingCollection.insertOne({
  //   town: 'Warsaw',
  //   famousePlaces: [
  //     {
  //       name: 'Krakow',
  //       population: '3000000',
  //       coordinates: {
  //         lat: '52.2323',
  //         lng: '21.1232',
  //       },
  //     },
  //     {
  //       name: 'Warsaw',
  //       population: '3000000',
  //       coordinates: {
  //         lat: '52.2323',
  //         lng: '21.1232',
  //       },
  //     },
  //   ],
  // });

  const event = await eventsCollection
    .aggregate([
      { $match: { _id: new ObjectId('61ed775939e0f3349e20519b') } },
      {
        $lookup: {
          from: 'Users',
          let: { signedUsers: '$signedUsers' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$_id', '$$signedUsers'],
                },
              },
            },
            {
              $project: {
                _id: 1,
                username: 1,
              },
            },
          ],
          as: 'signedUsers',
        },
      },
    ])
    .next();

  // const invite = await cursor.next();

  return event;
};

export default testing;
