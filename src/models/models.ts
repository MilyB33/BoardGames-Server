import { ObjectId, Collection } from 'mongodb';
import { JwtPayload } from 'jsonwebtoken';

// ========================================================

// User

export type RequestsEntry = {
  sent: ObjectId[];
  received: ObjectId[];
};

export interface UserEntry {
  _id: ObjectId;
  username: string;
}

export type User = {
  _id: ObjectId;
  username: string;
  friends: ObjectId[];
  friendsRequests: RequestsEntry;
  eventsRequests: RequestsEntry;
  token: string;
};

export type UserResult = User & {
  friends: UserEntry[];
};

export interface Secrets {
  username: string;
  password: string;
}

export interface UserEntryRequest {
  sent: UserEntry[];
  received: UserEntry[];
}

export interface UserInfo {
  friends: UserEntry[];
  friendsRequests: UserEntryRequest;
  eventsRequests: RequestsEntry;
  events: {
    userEvents: Event[];
    userSignedEvents: Event[];
    userInvitedEvents: Event[];
  };
}

export type LoginData = UserEntry & {
  token: string;
};

// ========================================================

// Events

export type inviteEntry = {
  _id: ObjectId;
  user: UserEntry;
};

export type EventResult = Event & {
  _id?: string;
  createdBy: UserEntry;
  createdAt: Date;
  signedUsers: UserEntry[];
  invites: inviteEntry[];
};

export type FullEvent = Event & {
  _id?: ObjectId;
  createdAt: string;
  createdBy: UserEntry;
  signedUsers: ObjectId[];
  invites: ObjectId[];
};

export type EventOptionally = {
  place?: string;
  date?: string;
  time?: string;
  game?: string;
  description?: string;
  location?: string;
  town?: string;
  maxPlayers?: number;
  isPrivate?: boolean;
};

export type Event = Required<EventOptionally>;

// ========================================================

// EventsInvites

export type EventInviteResult = {
  _id: ObjectId;
  eventId: ObjectId;
  user: UserEntry;
};

// ========================================================

// Collections

export type CollectionLimited<C, K extends keyof C> = {
  [Key in K]: C[Key];
};

export type UserCollection = Omit<User, 'token'> & {
  password: string;
};

export type EventsCollection = {
  _id: ObjectId;
  location: string;
  description: string;
  game: string;
  town: string;
  maxPlayers: number;
  isPrivate: boolean;
  date: string;
  time: string;
  createdBy: UserEntry;
  createdAt: string;
  signedUsers: ObjectId[];
  invites: ObjectId[];
};

export type EventInvitesCollection = {
  _id: ObjectId;
  eventId: ObjectId;
  users: {
    sent: ObjectId;
    received: ObjectId;
  };
};

export type CollectionsNames =
  | 'Users'
  | 'Events'
  | 'Test'
  | 'EventInvites';

export type CollectionsTypes = {
  Users: UserCollection;
  Events: EventsCollection;
  Test: any;
  EventInvites: EventInvitesCollection;
};

export type CollectionsLiteral = {
  Users: () => Collection<UserCollection>;
  Events: () => Collection<EventsCollection>;
  Test: () => Collection<any>;
  EventInvites: () => Collection<EventInvitesCollection>;
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

export type DecodedToken = JwtPayload & {
  token: string;
};

// ========================================================
