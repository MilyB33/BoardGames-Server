import { Request } from 'express';
import { MongoDBNamespace, Collection } from 'mongodb';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
