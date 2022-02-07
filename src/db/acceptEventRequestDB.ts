import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import BaseError from '../utils/Error';
import mongoQueries from '../models/mongoAggregateQueries';

import { EventResult } from '../models/models';

import logging from '../config/logging';

const NAMESPACE = 'acceptEventRequestDB';

export default async function acceptEventRequest(
  inviteId: string
): Promise<EventResult> {
  logging.info(NAMESPACE, 'acceptEventRequest');

  await DBClient.connect();

  const userCollection = DBClient.collection.Users();
  const eventInvitesCollection = DBClient.collection.EventInvites();
  const eventsCollection = DBClient.collection.Events();

  const inviteIdObject = new ObjectId(inviteId);

  const invite = await eventInvitesCollection.findOne({
    _id: inviteIdObject,
  });

  if (!invite) throw new BaseError('Invite not found', 404);

  await eventsCollection.updateOne(
    { _id: invite.eventId },
    {
      $pull: { invites: inviteIdObject },
      $push: { signedUsers: invite.users.received },
    }
  );

  await userCollection.bulkWrite([
    {
      updateOne: {
        filter: { _id: invite.users.sent },
        update: {
          $pull: { 'eventsRequests.sent': inviteIdObject },
        },
      },
    },
    {
      updateOne: {
        filter: { _id: invite.users.received },
        update: {
          $pull: {
            'eventsRequests.received': inviteIdObject,
          },
        },
      },
    },
  ]);

  await eventInvitesCollection.deleteOne({
    _id: inviteIdObject,
  });

  const event = await eventsCollection
    .aggregate<EventResult>([
      { $match: { _id: invite.eventId } },
      mongoQueries.eventQuery.signedUsers,
      mongoQueries.eventQuery.invites,
    ])
    .next();

  if (!event) throw new BaseError('Event not found', 404);

  return event;
}
