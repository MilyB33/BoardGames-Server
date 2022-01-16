import { ObjectId, Collection } from 'mongodb';

// Collections

export type CollectionLimited<C, K extends keyof C> = {
  [Key in K]: C[Key];
};

export type UserCollection = Omit<User, 'token'> & {
  password: string;
};

export type EventsCollection = FullEvent;

export type FriendsCollection = {
  _id: ObjectId | string;
  userId: ObjectId;
  friends: UserEntry[];
  requests: {
    sent: UserEntry[];
    received: UserEntry[];
  };
};

export type CollectionsNames =
  | 'Users'
  | 'Events'
  | 'Test'
  | 'Friends';

export type CollectionsTypes = {
  Users: UserCollection;
  Events: EventsCollection;
  Test: any;
};

export type CollectionsLiteral = {
  Users: () => Collection<UserCollection>;
  Events: () => Collection<EventsCollection>;
  Test: () => Collection<any>;
};

// ========================================================

// User

export type FriendsRequest = {
  sent: UserEntry[];
  received: UserEntry[];
};

export interface UserEntry {
  _id: ObjectId | string;
  username: string;
}

export type User = {
  _id: ObjectId | string;
  username: string;
  friends: UserEntry[];
  friendsRequests: FriendsRequest;
  token: string;
};

export interface Secrets {
  username: string;
  password: string;
}

// ========================================================

// Events

export type FullEvent = Event & {
  _id?: ObjectId; // Probably this should be required
  createdAt: string;
  createdBy: UserEntry;
  signedUsers: UserEntry[];
};

export type EventOptionally = {
  place?: string;
  date?: string;
  time?: string;
  game?: string;
  description?: string;
};

export type Event = Required<EventOptionally> & {
  location: string;
  town: string;
  maxPlayers: number;
};

// ========================================================

// Errors

export interface BaseErr {
  message: string;
  statusCode?: number;
  name: string;
}

export enum ErrorTypes {
  BaseError = 'BaseError',
  Error = 'Error',
}

export type InsertedEvent = Omit<FullEvent, '_id'>;

// Params

export type PaginationQuery = {
  offset?: string;
  limit?: string;
};

export type CustomQuery<T, E = {}> = {
  [key in keyof E]: E[key];
} & T;

// ========================================================
