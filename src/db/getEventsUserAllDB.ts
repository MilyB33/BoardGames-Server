import { ObjectId } from 'mongodb';
import DBClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'getEventsUserAllDB';

import { FullEvent, PaginationQuery } from '../models/models';

export default async function getEventsUserAll(
  userID: string,
  query: PaginationQuery
): Promise<FullEvent[]> {
  logging.debug(NAMESPACE, 'getEventsUserAll');

  const { offset, limit } = query;

  await DBClient.connect();

  const eventsCollection = DBClient.collection.Events();

  const events = await eventsCollection
    .aggregate<FullEvent>([
      { $match: { createdBy: { _id: new ObjectId(userID) } } },
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
