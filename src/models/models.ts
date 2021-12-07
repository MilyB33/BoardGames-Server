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
