import { ObjectId } from 'mongodb';
import logging from '../config/logging';
import DBClient from '../clients/mongoClient';

const NAMESPACE = 'deleteUserEventDB';

import { UserCollection } from '../models/models';

export default async function deleteUserEvent(
  userID: string
): Promise<void> {
  logging.debug(NAMESPACE, ' deleteUserEvent');

  await DBClient.connect();

  const eventsCollection = DBClient.collection.Events();
  const usersCollection = DBClient.collection.Users();
  const eventInvitesCollection = DBClient.collection.EventInvites();

  const eventRequests = await usersCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(userID),
        },
      },
      {
        $project: {
          _id: 0,
          eventRequests: {
            $concatArrays: [
              '$eventsRequests.sent',
              '$eventsRequests.received',
            ],
          },
        },
      },
    ])
    .next();

  const requests = eventRequests!.eventRequests.map(
    (e: string) => new ObjectId(e)
  );
  await eventsCollection.bulkWrite([
    {
      updateMany: {
        filter: {
          invites: { $in: requests },
        },
        update: {
          $pull: {
            invites: {
              $in: requests,
            },
          },
        },
      },
    },
    {
      updateMany: {
        filter: {
          signedUsers: { $elemMatch: { _id: new ObjectId(userID) } },
        },
        update: { $pull: { signedUsers: new ObjectId(userID) } },
      },
    },
    {
      deleteMany: {
        filter: { 'createdBy._id': new ObjectId(userID) },
      },
    },
  ]);

  await usersCollection.bulkWrite([
    {
      updateMany: {
        filter: {
          $or: [
            {
              'eventsRequests.sent': {
                $in: requests,
              },
              'eventsRequests.received': {
                $in: requests,
              },
            },
          ],
        },
        update: {
          $pull: {
            'eventsRequests.sent': {
              $in: requests,
            },
            'eventsRequests.received': {
              $in: requests,
            },
          },
        },
      },
    },
    {
      updateMany: {
        filter: {
          friends: { $in: [new ObjectId(userID)] },
        },
        update: { $pull: { friends: new ObjectId(userID) } },
      },
    },
    {
      updateMany: {
        filter: {
          'friendsRequests.received': { $in: [new ObjectId(userID)] },
        },
        update: {
          $pull: {
            'friendsRequests.received': new ObjectId(userID),
            'friendsRequests.sent': new ObjectId(userID),
          },
        },
      },
    },
    {
      deleteOne: {
        filter: { _id: new ObjectId(userID) },
      },
    },
  ]);

  await eventInvitesCollection.deleteMany({
    _id: { $in: [...requests] },
  });
}
