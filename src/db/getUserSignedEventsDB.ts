import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import logging from '../config/logging';

import { PaginationQuery } from '../models/models';

const NAMESPACE = 'getUserSignedEvents';

import { FullEvent } from '../models/models';

export default async function getUserSignedEventsDB(
  userID: string,
  query: PaginationQuery
): Promise<FullEvent[]> {
  logging.info(NAMESPACE, 'getUserSignedEvents');

  const { offset, limit } = query;

  await DBClient.connect();

  const eventsCollection = DBClient.collection.Events();

  const events = await eventsCollection
    .aggregate<FullEvent>([
      {
        $match: {
          createdBy: { _id: new ObjectId(userID) },
          signedUsers: { $elemMatch: new ObjectId(userID) },
        },
      },
      { $skip: offset ? parseInt(offset) : 0 },
      { $limit: limit ? parseInt(limit) : 0 },
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
          ],
          as: 'signedUsers',
        },
      },
    ])
    .toArray();

  return events;
}
