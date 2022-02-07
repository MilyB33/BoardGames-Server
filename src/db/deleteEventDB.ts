import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import logging from '../config/logging';
import BaseError from '../utils/Error';
import { transformEventInvitesInfo } from '../utils/helperFunctions';

const NAMESPACE = 'DeleteEventDB';

export default async function deleteEvent(
  userID: string,
  eventID: string
): Promise<void> {
  logging.debug(NAMESPACE, ' deleteUserEvent');

  await DBClient.connect();

  const eventsCollection = DBClient.collection.Events();
  const userCollection = DBClient.collection.Users();
  const eventInvitesCollection = DBClient.collection.EventInvites();

  const eventIDObject = new ObjectId(eventID);
  const userIDObject = new ObjectId(userID);

  const invitesInfo = await eventInvitesCollection
    .find({ eventId: eventIDObject })
    .toArray();

  if (!invitesInfo) throw new BaseError('Event not found');

  const transformedInfo = transformEventInvitesInfo(invitesInfo);

  await userCollection.bulkWrite([
    {
      updateMany: {
        filter: {
          _id: { $in: transformedInfo.allUsersIds },
        },
        update: {
          $pull: {
            'eventsRequests.received': {
              $in: transformedInfo.eventInvitesIds,
            },
            'eventsRequests.sent': {
              $in: transformedInfo.eventInvitesIds,
            },
          },
        },
      },
    },
  ]);

  await eventInvitesCollection.deleteMany({
    _id: { $in: transformedInfo.eventInvitesIds },
  });

  await eventsCollection.deleteOne({
    _id: eventIDObject,
    'createdBy._id': userIDObject,
  });
}
