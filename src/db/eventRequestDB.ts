import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import BaseError from '../utils/Error';
import {
  mapUserEntries,
  sortUsersInOrder,
} from '../utils/helperFunctions';

import { User } from '../models/models';

interface Body {
  requestedUserID: string;
  eventID: string;
}

export default async function eventRequest(
  userID: string,
  body: Body
) {
  const { requestedUserID, eventID } = body;

  await DBClient.connect();

  const userCollection = DBClient.collection.Users();
  const eventsCollection = DBClient.collection.Events();
  const eventInvitesCollection = DBClient.collection.EventInvites();

  const usersIDs = [
    new ObjectId(userID),
    new ObjectId(requestedUserID),
  ];

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
            if: { $eq: ['$_id', new ObjectId(userID)] },
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

  const insertedID = await eventInvitesCollection.insertOne({
    eventId: new ObjectId(eventID),
    users: {
      sent: new ObjectId(userID),
      received: new ObjectId(requestedUserID),
    },
  });

  await userCollection.bulkWrite([
    {
      updateOne: {
        filter: {
          _id: new ObjectId(userID),
        },
        update: {
          $push: {
            'eventsRequests.sent': new ObjectId(
              insertedID.insertedId
            ),
          },
        },
      },
    },
    {
      updateOne: {
        filter: {
          _id: new ObjectId(requestedUserID),
        },
        update: {
          $push: {
            'eventsRequests.received': new ObjectId(
              insertedID.insertedId
            ),
          },
        },
      },
    },
  ]);

  await eventsCollection.updateOne(
    {
      _id: new ObjectId(eventID),
    },
    {
      $push: {
        invites: new ObjectId(insertedID.insertedId),
      },
    }
  );

  return {
    _id: insertedID.insertedId,
    eventId: eventID,
    user: {
      _id: users[1]._id,
      username: users[1].username,
    },
  };
}
