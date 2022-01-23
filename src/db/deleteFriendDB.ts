import { ObjectId } from "mongodb";
import DBClient from "../clients/mongoClient";
import logging from "../config/logging";
import BaseError from "../utils/Error";

import { mapUserEntries, sortUsersInOrder } from "../utils/helperFunctions";

import { User } from "../models/models";

const NAMESPACE = "deleteFriendDB";

export default async function deleteFriend(userID: string, friendID: string) {
  logging.debug(NAMESPACE, "deleteFriend");

  await DBClient.connect();

  const userCollection = DBClient.collection.Users();

  const userIDs = [new ObjectId(userID), new ObjectId(friendID)];

  const cursor = userCollection.aggregate<User>([
    {
      $match: {
        _id: { $in: userIDs },
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        friends: {
          $cond: {
            if: { $eq: ["$_id", new ObjectId(userID)] },
            then: "$friends",
            else: "$$REMOVE",
          },
        },
        friendsRequests: {
          $cond: {
            if: { $eq: ["$_id", new ObjectId(userID)] },
            then: "$friendsRequests",
            else: "$$REMOVE",
          },
        },
      },
    },
  ]);

  const users = sortUsersInOrder<User>(await cursor.toArray(), userIDs);

  if (!users[0] || !users[1]) throw new BaseError("User not found");

  if (!users[0].friends.map(mapUserEntries).includes(users[1]._id.toString()))
    throw new BaseError("User not in friends list");

  await userCollection.bulkWrite([
    {
      updateOne: {
        filter: { _id: users[0]._id },
        update: { $pull: { friends: users[1]._id } },
      },
    },
    {
      updateOne: {
        filter: { _id: users[1]._id },
        update: { $pull: { friends: users[0]._id } },
      },
    },
  ]);
}
