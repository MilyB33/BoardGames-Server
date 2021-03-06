import { ObjectId } from 'mongodb';
import MongoCustomClient from '../clients/mongoClient';
import logging from '../config/logging';
import mongoQueries from '../models/mongoAggregateQueries';

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

  const user = await userCollection
    .aggregate([
      { $match: { username: 'Admin' } },
      mongoQueries.eventQuery.userEvents,
      mongoQueries.eventQuery.signedEvents,
      mongoQueries.eventQuery.userInvitedEvents,
      mongoQueries.userQuery.friends,
      ...mongoQueries.userQuery.friendsRequest,
      {
        $project: {
          _id: 0,
          friends: 1,
          friendsRequests: 1,
          eventsRequests: 1,
          events: {
            userEvents: 1,
            userSignedEvents: 1,
            userInvitedEvents: '$events.userInvitedEvents.event',
          },
        },
      },
    ])
    .next();

  return user;
};

export default testing;
