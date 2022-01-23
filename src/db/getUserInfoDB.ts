import { ObjectId } from "mongodb";
import DBClient from "../clients/mongoClient";
import logging from "../config/logging";

import { UserInfo } from "../models/models";

const NAMESPACE = "getUserInfoDB";

export default async function getUserInfo(userID: string) {
  logging.info(NAMESPACE, "getUserInfo");

  await DBClient.connect();

  const collection = DBClient.collection.Users();

  // User Projection
  const userProjection = {
    $project: {
      _id: 1,
      username: 1,
    },
  };

  // Limit Option
  const limitOption = { $limit: 5 };

  // FriendsRequests Option
  const friendsRequestsOptions = [
    {
      $lookup: {
        from: "Users",
        let: { userID: "$_id" },
        pipeline: [
          { $match: { $expr: { $in: ["$$userID", "$friendsRequests.received"] } } },
          limitOption,
          userProjection,
        ],
        as: "friendsRequests.sent",
      },
    },
    {
      $lookup: {
        from: "Users",
        let: { userID: "$_id" },
        pipeline: [
          { $match: { $expr: { $in: ["$$userID", "$friendsRequests.sent"] } } },
          limitOption,
          userProjection,
        ],
        as: "friendsRequests.received",
      },
    },
  ];

  // friends Option
  const friendsOptions = {
    $lookup: {
      from: "Users",
      let: { userID: "$_id" },
      pipeline: [
        { $match: { $expr: { $in: ["$$userID", "$friends"] } } },
        userProjection,
        limitOption,
      ],
      as: "friends",
    },
  };

  //concat invites with events
  const invites = {
    $lookup: {
      from: "EventInvites",
      let: { eventId: "$_eventId" },
      pipeline: [
        { $match: { $expr: { $eq: ["$eventID", "$$eventId"] } } },
        {
          $lookup: {
            from: "Users",
            let: { userId: "$users.received" },
            pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$userId"] } } }, userProjection],
            as: "users.received",
          },
        },
        {
          $project: {
            _id: 1,
            user: { $arrayElemAt: ["$users.received", 0] },
          },
        },
      ],
      as: "invites",
    },
  };

  // userEvents Option
  const userEventsOptions = {
    $lookup: {
      from: "Events",
      let: { userId: "$_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$createdBy._id", "$$userId"] } } },
        { $limit: 5 },
        {
          $lookup: {
            from: "Users",
            let: { signedUsers: "$signedUsers" },
            pipeline: [{ $match: { $expr: { $in: ["$_id", "$$signedUsers"] } } }, userProjection],
            as: "signedUsers",
          },
        },
        invites,
      ],
      as: "events.userEvents",
    },
  };

  // signedEvents Option
  const signedEventsOptions = {
    $lookup: {
      from: "Events",
      let: { userID: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $in: ["$$userID", "$signedUsers"] },
                { $not: { $eq: ["$$userID", "$createdBy._id"] } },
              ],
            },
          },
        },
        limitOption,
      ],
      as: "events.userSignedEvents",
    },
  };

  // userInvitedEvents Option
  const userInvitedEventsOptions = {
    $lookup: {
      from: "EventInvites",
      let: { userID: "$_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$users.received", "$$userID"] } } },
        {
          $lookup: {
            from: "Events",
            localField: "eventId",
            foreignField: "_id",
            as: "event",
          },
        },
        {
          $project: {
            _id: 1,
            event: { $arrayElemAt: ["$event", 0] },
            invitedBy: "$users.sent",
          },
        },
        {
          $set: {
            "event.invitedBy": "$invitedBy",
            "event.inviteId": "$_id",
          },
        },
      ],
      as: "events.userInvitedEvents",
    },
  };

  // aggregate
  const cursor = collection.aggregate([
    { $match: { _id: new ObjectId(userID) } },
    userEventsOptions,
    signedEventsOptions,
    userInvitedEventsOptions,
    friendsOptions,
    ...friendsRequestsOptions,
    {
      $project: {
        _id: 0,
        friends: 1,
        friendsRequests: 1,
        eventsRequests: 1,
        events: {
          userEvents: 1,
          userSignedEvents: 1,
          userInvitedEvents: "$events.userInvitedEvents.event",
        },
      },
    },
  ]);

  let userData = await cursor.next();

  return userData;
}
