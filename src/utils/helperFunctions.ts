import {
  UserEntry,
  ID,
  EventInvitesCollection,
} from '../models/models';

import { ObjectId } from 'mongodb';

export const mapUserEntries = (entry: ID) => entry.toString();

export const sortUsersInOrder = <T>(arr: any[], order: any[]): T[] =>
  arr.sort(
    (a: any, b: any) =>
      order.findIndex((o) => o.toString() === a._id.toString()) -
      order.findIndex((o) => o.toString() === b._id.toString())
  );

export const transformEventInvitesInfo = (
  EventInvites: EventInvitesCollection[]
) => ({
  eventInvitesIds: EventInvites.map(
    (invite) => new ObjectId(invite._id)
  ),
  usersSentIds: EventInvites.map(
    (invite) => new ObjectId(invite.users.sent)
  ),
  usersReceivedIds: EventInvites.map(
    (invite) => new ObjectId(invite.users.received)
  ),
  eventIds: EventInvites.map(
    (invite) => new ObjectId(invite.eventId)
  ),
  allUsersIds: EventInvites.reduce(
    (acc, invite) => [
      ...acc,
      new ObjectId(invite.users.sent),
      new ObjectId(invite.users.received),
    ],
    [] as ID[]
  ),
  setOfUsers: new Set(
    EventInvites.reduce(
      (acc, invite) => [
        ...acc,
        new ObjectId(invite.users.sent),
        new ObjectId(invite.users.received),
      ],
      [] as ID[]
    )
  ),
});
