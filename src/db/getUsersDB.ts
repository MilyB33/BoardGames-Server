import DBClient from '../clients/mongoClient';
import logging from '../config/logging';

import { UserEntry, PaginationQuery } from '../models/models';

export default async function getUsers(
  query: PaginationQuery & { username?: string }
): Promise<UserEntry[]> {
  logging.debug('getUsersDB', 'getUsers');

  await DBClient.connect();

  const { offset, limit, username } = query;

  let regex = new RegExp(`${username}`, 'i');

  const searchQuery = username ? { username: { $regex: regex } } : {};

  const usersCollection = DBClient.collection.Users();

  const users = await usersCollection
    .find(searchQuery, { projection: { _id: 1, username: 1 } })
    .skip(Number(offset) || 0)
    .limit(Number(limit) || 5)
    .toArray();

  return users;
}
