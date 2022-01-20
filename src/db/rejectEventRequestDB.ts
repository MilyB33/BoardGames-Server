import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import BaseError from '../utils/Error';

interface Body {
  eventID: string;
}

export default async function rejectEventRequest(
  userID: string,
  body: Body
) {
  // const { eventID } = body;
  // await DBClient.connect();
  // const userCollection = DBClient.collection.Users();
  // const user = await userCollection.findOne(
  //   {
  //     _id: new ObjectId(userID),
  //   },
  //   {
  //     projection: {
  //       _id: 1,
  //       username: 1,
  //       'eventsRequests.received': 1,
  //     },
  //   }
  // );
  // if (!user) throw new BaseError('User not found');
  // const event = user.eventsRequests.received.find(
  //   (event) => event.eventId.toString() === eventID
  // );
  // await userCollection.bulkWrite([
  //   {
  //     updateOne: {
  //       filter: {
  //         _id: new ObjectId(userID),
  //       },
  //       update: {
  //         $pull: {
  //           'eventsRequests.received': event,
  //         },
  //       },
  //     },
  //   },
  //   {
  //     updateOne: {
  //       filter: {
  //         _id: new ObjectId(event?.user?._id),
  //       },
  //       update: {
  //         $pull: {
  //           'eventsRequests.sent': {
  //             eventId: new ObjectId(eventID),
  //             user: {
  //               _id: new ObjectId(userID),
  //               username: user.username,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  // ]);
}
