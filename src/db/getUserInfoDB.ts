import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import mongoQueries from '../models/mongoAggregateQueries';

import logging from '../config/logging';

const NAMESPACE = 'getUserInfoDB';

export default async function getUserInfo(userID: string) {
  logging.info(NAMESPACE, 'getUserInfo');

  await DBClient.connect();

  const collection = DBClient.collection.Users();

  // aggregate
  const cursor = collection.aggregate([
    { $match: { _id: new ObjectId(userID) } },
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
  ]);

  let userData = await cursor.next();

  return userData;
}
