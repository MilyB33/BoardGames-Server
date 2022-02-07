import { EventInvitesCollection } from '../models/models';

import { ObjectId } from 'mongodb';

export const mapUserEntries = (entry: ObjectId) => entry.toString();

export const mapIds = (entry: string) => new ObjectId(entry);

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
    [] as ObjectId[]
  ),
  setOfUsers: new Set(
    EventInvites.reduce(
      (acc, invite) => [
        ...acc,
        new ObjectId(invite.users.sent),
        new ObjectId(invite.users.received),
      ],
      [] as ObjectId[]
    )
  ),
});

export const typeGuard = <
  DT extends {
    [key: string]: any;
  },
  T extends DT
>(
  data: DT,
  field: string
): data is T => {
  return Boolean((data as T)[field]);
};
