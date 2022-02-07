import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import BaseError from '../utils/Error';

export default async function rejectEventRequest(
  inviteId: string
): Promise<void> {
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
    { $pull: { invites: inviteIdObject } }
  );

  await userCollection.bulkWrite([
    {
      updateOne: {
        filter: { _id: invite.users.sent },
        update: {
          $pull: {
            'eventsRequests.sent': inviteIdObject,
          },
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
}
