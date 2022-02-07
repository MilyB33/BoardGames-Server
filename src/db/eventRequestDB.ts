import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import BaseError from '../utils/Error';
import {
  sortUsersInOrder,
  mapIds,
  mapUserEntries,
} from '../utils/helperFunctions';

import { User, EventInviteResult } from '../models/models';

interface Body {
  requestedUserID: string;
  eventID: string;
}

export default async function eventRequest(
  userID: string,
  body: Body
): Promise<EventInviteResult> {
  const { requestedUserID, eventID } = body;

  await DBClient.connect();

  const userCollection = DBClient.collection.Users();
  const eventsCollection = DBClient.collection.Events();
  const eventInvitesCollection = DBClient.collection.EventInvites();

  const usersIDs = [userID, requestedUserID].map(mapIds);

  const userIDObject = new ObjectId(userID);
  const requestedUserIDObject = new ObjectId(requestedUserID);
  const eventIDObject = new ObjectId(eventID);

  const cursor = userCollection.aggregate<User>([
    {
      $match: {
        _id: { $in: usersIDs },
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        friends: {
          $cond: {
            if: { $eq: ['$_id', userIDObject] },
            then: '$friends',
            else: '$$REMOVE',
          },
        },
      },
    },
  ]);

  const users = sortUsersInOrder<User>(
    await cursor.toArray(),
    usersIDs
  );

  if (!users[0]) throw new BaseError('User not found');

  if (!users[1]) throw new BaseError('Requested User not found');

  const { friends } = users[0];

  if (!friends.map(mapUserEntries).includes(users[1]._id.toString()))
    throw new BaseError('User not in friends list');

  const result = await eventInvitesCollection.insertOne({
    eventId: eventIDObject,
    users: {
      sent: userIDObject,
      received: requestedUserIDObject,
    },
  });

  const insertedId = result.insertedId;

  await userCollection.bulkWrite([
    {
      updateOne: {
        filter: {
          _id: userIDObject,
        },
        update: {
          $push: {
            'eventsRequests.sent': insertedId,
          },
        },
      },
    },
    {
      updateOne: {
        filter: {
          _id: requestedUserIDObject,
        },
        update: {
          $push: {
            'eventsRequests.received': insertedId,
          },
        },
      },
    },
  ]);

  await eventsCollection.updateOne(
    { _id: eventIDObject },
    { $push: { invites: insertedId } }
  );

  return {
    _id: insertedId,
    eventId: eventIDObject,
    user: {
      _id: users[1]._id,
      username: users[1].username,
    },
  };
}
