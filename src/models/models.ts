import { ObjectId } from 'mongodb';

// Collections

export type CollectionLimited<C, K extends keyof C> = {
  [Key in K]: C[Key];
};

export type UserCollection = Omit<User, 'token'> & {
  password: string;
};

export type FriendsRequest = {
  _id: ObjectId;
  userID: ObjectId;
  requests: {
    sent: ObjectId[];
    received: ObjectId[];
  };
};

export type EventsCollection = FullEvent;

// ========================================================

// User

export interface UserEntry {
  _id: ObjectId | string;
  username: string;
}

export type User = {
  _id: ObjectId | string;
  username: string;
  friends: ObjectId[];
  friendsRequests: ObjectId[];
  token: string;
};

export interface Secrets {
  username: string;
  password: string;
}

// ========================================================

// Events

export interface Event {
  place: string;
  date: string;
  time: string;
  game: string;
  description: string;
  location: string;
  town: string;
  maxPlayers: number;
}

export type FullEvent = Event & {
  _id?: ObjectId; // Probably this should be required
  createdAt: string;
  createdBy: UserEntry;
  signedUsers: UserEntry[];
};

export interface EventOptionally {
  place?: string;
  date?: string;
  time?: string;
  game?: string;
  description?: string;
}

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

// ========================================================
