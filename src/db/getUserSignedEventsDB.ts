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
      {
        $lookup: {
          from: 'EventInvites',
          let: { eventId: '$_eventId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$eventID', '$$eventId'],
                },
              },
            },
            {
              $project: {
                _id: 0,
                'users.received': 1,
              },
            },
          ],
          as: 'invites',
        },
      },
      {
        $set: {
          invites: { $concatArrays: ['$invites.users.received'] },
        },
      },
    ])
    .toArray();

  return events;
}
