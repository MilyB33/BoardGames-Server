import DBClient from '../clients/mongoClient';
import logging from '../config/logging';

const NAMESPACE = 'getEventsAllDB';

import { FullEvent, PaginationQuery } from '../models/models';

export default async function getEventsAllDB(
  query: PaginationQuery
): Promise<FullEvent[]> {
  logging.debug(NAMESPACE, 'getEventsAllDB');

  const { offset, limit } = query;

  await DBClient.connect();

  const eventsCollection = DBClient.collection.Events();

  const events = await eventsCollection
    .aggregate<FullEvent>([
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

  console.log(events);

  return events;
}
