import { Document, WithId, ModifyResult } from 'mongodb';

export interface BaseErr {
  message: string;
  statusCode?: number;
  name: string;
}

export enum ErrorTypes {
  BaseError = 'BaseError',
  Error = 'Error',
}

export interface Secrets {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  token: string;
}

export interface Event {
  place: string;
  date: string;
  time: string;
  game: string;
  description: string;
}

export interface EventOptionally {
  place?: string;
  date?: string;
  time?: string;
  game?: string;
  description?: string;
}

export interface FullEvent {
  date: string;
  time: string;
  game: string;
  description: string;
  location: string;
  town: string;
  createdAt: string;
  createdBy: {
    _id: string;
    username: string;
  };
  _id: string;
  maxPlayers: number;
  signedUsers: {
    _id: string;
    username: string;
  }[];
}

export type MongoDocument<T> = WithId<Document & T>;

// ========================================================

export type FullEventDocument = MongoDocument<FullEvent>;

export type ModifiedEventDocument = ModifyResult;
