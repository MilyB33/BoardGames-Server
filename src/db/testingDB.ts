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

  // const invite = await eventInvitesCollection.findOne({
  //   _id: new ObjectId(inviteId),
  // });

  // User Projection
  const userProjection = {
    $project: {
      _id: 1,
      username: 1,
    },
  };

  // Limit Option
  const limitOption = { $limit: 5 };

  // FriendsRequests Option
  const friendsRequestsOptions = [
    {
      $lookup: {
        from: 'Users',
        let: { userID: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$$userID', '$friendsRequests.received'],
              },
            },
          },
          limitOption,
          userProjection,
        ],
        as: 'friendsRequests.sent',
      },
    },
    {
      $lookup: {
        from: 'Users',
        let: { userID: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$$userID', '$friendsRequests.sent'],
              },
            },
          },
          limitOption,
          userProjection,
        ],
        as: 'friendsRequests.received',
      },
    },
  ];

  // friends Option
  const friendsOptions = {
    $lookup: {
      from: 'Users',
      let: { userID: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: {
              $in: ['$$userID', '$friends'],
            },
          },
        },
        userProjection,
        limitOption,
      ],
      as: 'friends',
    },
  };

  //concat invites with events
  const invites = {
    $lookup: {
      from: 'EventInvites',
      let: { eventId: '$_eventId' },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$eventID', '$$eventId'],
            },
          },
        },
        {
          $lookup: {
            from: 'Users',
            let: { userId: '$users.received' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$userId'],
                  },
                },
              },
              userProjection,
            ],
            as: 'users.received',
          },
        },
        {
          $project: {
            _id: 1,
            user: {
              $arrayElemAt: ['$users.received', 0],
            },
          },
        },
      ],
      as: 'invites',
    },
  };

  // userEvents Option
  const userEventsOptions = {
    $lookup: {
      from: 'Events',
      let: { userId: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$createdBy._id', '$$userId'],
            },
          },
        },
        { $limit: 5 },
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
              userProjection,
            ],
            as: 'signedUsers',
          },
        },
        invites,
      ],
      as: 'events.userEvents',
    },
  };

  // signedEvents Option
  const signedEventsOptions = {
    $lookup: {
      from: 'Events',
      let: { userID: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $in: ['$$userID', '$signedUsers'] },
                { $not: { $eq: ['$$userID', '$createdBy._id'] } },
              ],
            },
          },
        },
        limitOption,
      ],
      as: 'events.userSignedEvents',
    },
  };

  // invitedEvents Option
  const invitedEventsOptions = {
    $lookup: {
      from: 'EventInvites',
      let: { userID: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$users.received', '$$userID'],
            },
          },
        },
        {
          $lookup: {
            from: 'Events',
            localField: 'eventId',
            foreignField: '_id',
            as: 'event',
          },
        },
        {
          $project: {
            _id: 1,
            event: { $arrayElemAt: ['$event', 0] },
            invitedBy: '$users.sent',
          },
        },
        {
          $set: {
            'event.invitedBy': '$invitedBy',
            'event.inviteId': '$_id',
          },
        },
      ],
      as: 'events.userInvitedEvents',
    },
  };

  // aggregate
  const cursor = userCollection.aggregate([
    { $match: { username: 'trzeci' } },
    userEventsOptions,
    signedEventsOptions,
    invitedEventsOptions,
    friendsOptions,
    ...friendsRequestsOptions,
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

  const invite = await cursor.next();

  return invite;
};

export default testing;
