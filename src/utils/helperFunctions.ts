import { UserEntry, ID } from '../models/models';

export const mapUserEntries = (entry: ID) => entry.toString();

export const sortUsersInOrder = <T>(arr: any[], order: any[]): T[] =>
  arr.sort(
    (a: any, b: any) =>
      order.findIndex((o) => o.toString() === a._id.toString()) -
      order.findIndex((o) => o.toString() === b._id.toString())
  );
