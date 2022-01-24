import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import BaseError from '../utils/Error';
import logging from '../config/logging';

const NAMESPACE = 'acceptEventRequestDB';

export default async function acceptEventRequest(inviteId: string) {
  logging.info(NAMESPACE, 'acceptEventRequest');

  await DBClient.connect();

  const userCollection = DBClient.collection.Users();
  const eventInvitesCollection = DBClient.collection.EventInvites();
  const eventsCollection = DBClient.collection.Events();

  const invite = await eventInvitesCollection.findOne({
    _id: new ObjectId(inviteId),
  });

  if (!invite) throw new BaseError('Invite not found', 404);

  const updatedId = await eventsCollection.updateOne(
    { _id: new ObjectId(invite.eventId) },
    {
      $pull: { invites: new ObjectId(inviteId) },
      $push: { signedUsers: new ObjectId(invite.users.received) },
    }
  );

  await userCollection.bulkWrite([
    {
      updateOne: {
        filter: { _id: new ObjectId(invite.users.sent) },
        update: {
          $pull: { 'eventsRequests.sent': new ObjectId(inviteId) },
        },
      },
    },
    {
      updateOne: {
        filter: { _id: new ObjectId(invite.users.received) },
        update: {
          $pull: {
            'eventsRequests.received': new ObjectId(inviteId),
          },
        },
      },
    },
  ]);

  await eventInvitesCollection.deleteOne({
    _id: new ObjectId(inviteId),
  });

  const event = await eventsCollection
    .aggregate([
      { $match: { _id: new ObjectId(invite.eventId) } },
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

  return event;
}
