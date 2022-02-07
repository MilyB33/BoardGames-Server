import { ObjectId } from 'mongodb';
import logging from '../config/logging';
import DBClient from '../clients/mongoClient';
import { mapIds } from '../utils/helperFunctions';
import BaseError from '../utils/Error';

const NAMESPACE = 'deleteUserEventDB';

type EventRequests = {
  eventRequests: ObjectId[];
};

export default async function deleteUserEvent(
  userID: string
): Promise<void> {
  logging.debug(NAMESPACE, ' deleteUserEvent');

  await DBClient.connect();

  const eventsCollection = DBClient.collection.Events();
  const usersCollection = DBClient.collection.Users();
  const eventInvitesCollection = DBClient.collection.EventInvites();

  const userIDObject = new ObjectId(userID);

  const result = await usersCollection
    .aggregate<EventRequests>([
      { $match: { _id: userIDObject } },
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

  if (!result) throw new BaseError('User not found', 404);

  const requests = result.eventRequests;

  await eventsCollection.bulkWrite([
    {
      updateMany: {
        filter: { invites: { $in: requests } },
        update: {
          $pullAll: {
            invites: requests,
          },
        },
      },
    },
    {
      updateMany: {
        filter: { signedUsers: { $in: [userIDObject] } },
        update: { $pull: { signedUsers: userIDObject } },
      },
    },
    {
      deleteMany: { filter: { 'createdBy._id': userIDObject } },
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
            },
            {
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
        filter: { friends: { $in: [userIDObject] } },
        update: { $pull: { friends: userIDObject } },
      },
    },
    {
      updateMany: {
        filter: {
          'friendsRequests.received': { $in: [userIDObject] },
        },
        update: {
          $pull: {
            'friendsRequests.received': userIDObject,
            'friendsRequests.sent': userIDObject,
          },
        },
      },
    },
    {
      deleteOne: {
        filter: { _id: userIDObject },
      },
    },
  ]);

  await eventInvitesCollection.deleteMany({
    _id: { $in: [...requests] },
  });
}
