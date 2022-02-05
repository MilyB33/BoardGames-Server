import { ObjectId } from 'mongodb';

const limit = { $limit: 5 };

// ====== Users ======

// Represents basic user info
const userEntry = {
  $project: {
    _id: 1,
    username: 1,
  },
};

// Represents user info with friends
const userEntryWithFriends = (userID: string) => ({
  $project: {
    _id: 1,
    username: 1,
    friends: {
      $cond: {
        if: { $eq: ['$_id', new ObjectId(userID)] },
        then: '$friends',
        else: '$$REMOVE',
      },
    },
    friendsRequests: {
      $cond: {
        if: { $eq: ['$_id', new ObjectId(userID)] },
        then: '$friendsRequests',
        else: '$$REMOVE',
      },
    },
  },
});

// reverses friends requests
const friendsRequest = [
  {
    $lookup: {
      from: 'Users',
      let: { userID: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: {
              $in: ['$$userID', '$friendsRequests.received'],
            },
          },
        },
        userEntry,
      ],
      as: 'friendsRequests.sent',
    },
  },
  {
    $lookup: {
      from: 'Users',
      let: { userID: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: { $in: ['$$userID', '$friendsRequests.sent'] },
          },
        },
        userEntry,
      ],
      as: 'friendsRequests.received',
    },
  },
];

// Represents user info in friends array
const friends = {
  $lookup: {
    from: 'Users',
    let: { userID: '$_id' },
    pipeline: [
      { $match: { $expr: { $in: ['$$userID', '$friends'] } } },
      userEntry,
    ],
    as: 'friends',
  },
};

// ======= Events =======

// Connects users data with events data
const signedUsers = {
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
      userEntry,
    ],
    as: 'signedUsers',
  },
};

// Connects data from EventIntvites to Events and add users info
const invites = {
  $lookup: {
    from: 'EventInvites',
    let: { eventId: '$_eventId' },
    pipeline: [
      { $match: { $expr: { $eq: ['$eventID', '$$eventId'] } } },
      {
        $lookup: {
          from: 'Users',
          let: { userId: '$users.received' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
            userEntry,
          ],
          as: 'users.received',
        },
      },
      {
        $project: {
          _id: 1,
          user: { $arrayElemAt: ['$users.received', 0] },
        },
      },
    ],
    as: 'invites',
  },
};

// Connects data from EventInvites to Events
const invitesWithoutInfo = [
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
];

// Represents user event info
const userEvents = {
  $lookup: {
    from: 'Events',
    let: { userId: '$_id' },
    pipeline: [
      {
        $match: { $expr: { $eq: ['$createdBy._id', '$$userId'] } },
      },
      signedUsers,
      invites,
    ],
    as: 'events.userEvents',
  },
};

// Represents info about event which user is signed to
const signedEvents = {
  $lookup: {
    from: 'Events',
    let: { userID: '$_id' },
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              { $in: ['$$userID', '$signedUsers'] },
              { $not: { $eq: ['$$userID', '$createdBy._id'] } },
            ],
          },
        },
      },
      signedUsers,
    ],
    as: 'events.userSignedEvents',
  },
};

// Represents info about event which user is invited to
const userInvitedEvents = {
  $lookup: {
    from: 'EventInvites',
    let: { userID: '$_id' },
    pipeline: [
      {
        $match: { $expr: { $eq: ['$users.received', '$$userID'] } },
      },
      {
        $lookup: {
          from: 'Events',
          let: { eventID: '$eventId' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$eventID'] } } },
            signedUsers,
          ],
          as: 'event',
        },
      },
      {
        $lookup: {
          from: 'Users',
          let: { userID: '$users.sent' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$userID'] } } },
            userEntry,
          ],
          as: 'invitedBy',
        },
      },
      {
        $project: {
          _id: 1,
          event: { $arrayElemAt: ['$event', 0] },
          invitedBy: { $arrayElemAt: ['$invitedBy', 0] },
        },
      },
      {
        $set: {
          'event.invitedBy': '$invitedBy',
          'event.inviteId': '$_id',
        },
      },
    ],
    as: 'events.userInvitedEvents',
  },
};

export default {
  eventQuery: {
    signedUsers,
    userEvents,
    signedEvents,
    userInvitedEvents,
    invites,
    invitesWithoutInfo,
  },
  userQuery: {
    userEntry,
    friendsRequest,
    friends,
    userEntryWithFriends,
  },
};
