import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import BaseError from '../utils/Error';
import { mapUserEntries } from '../utils/helperFunctions';

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

  const user = await userCollection.findOne(
    {
      _id: new ObjectId(userID),
    },
    { projection: { _id: 1, username: 1 } }
  );

  if (!user) throw new BaseError('User not found');

  const requestedUser = await userCollection.findOne(
    {
      _id: new ObjectId(requestedUserID),
    },
    { projection: { _id: 1, username: 1 } }
  );

  if (!requestedUser) throw new BaseError('Requested User not found');

  if (!user.friends.map(mapUserEntries).includes(requestedUser._id))
    throw new BaseError('User not in friends list');

  await userCollection.updateOne(
    { _id: new ObjectId(userID) },
    {
      $push: {
        'eventsRequests.sent': {
          user: requestedUser,
          eventId: new ObjectId(eventID),
        },
      },
    }
  );

  await userCollection.updateOne(
    { _id: new ObjectId(requestedUserID) },
    {
      $push: {
        'eventsRequests.received': {
          user: user,
          eventId: new ObjectId(eventID),
        },
      },
    }
  );

  return {
    user: requestedUser,
    eventId: eventID,
  };
}
