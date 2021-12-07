import MongoCustomClient from '../clients/mongoClient';
import { Request, Response } from 'express';
import { ErrorTypes, BaseErr } from '../models/models';

import addEventDB from '../db/addEventDB';
import getEventsAllDB from '../db/getEventsAllDB';
import getEventsUserAllDB from '../db/getEventsUserAllDB';
import getUserEventDB from '../db/getUserEventDB';
import deleteEventDB from '../db/deleteEventDB';

const getEventsAll = async (req: Request, res: Response) => {
  try {
    const events = await getEventsAllDB();

    res.status(200).send({
      events,
    });
  } catch (err) {
    const { name } = err as Error | BaseErr;

    if (name === ErrorTypes.BaseError) {
      const { message, statusCode } = err as BaseErr;
      if (statusCode) res.status(statusCode).json({ message });
    } else res.status(500).json({ message: 'Something went wrong' });
  } finally {
    MongoCustomClient.close();
  }
};

const getUserEventsAll = async (req: Request, res: Response) => {
  try {
    const events = await getEventsUserAllDB(req.params.userID);

    res.status(200).send({
      events,
    });
  } catch (err) {
    const { name } = err as Error | BaseErr;

    if (name === ErrorTypes.BaseError) {
      const { message, statusCode } = err as BaseErr;
      if (statusCode) res.status(statusCode).json({ message });
    } else res.status(500).json({ message: 'Something went wrong' });
  } finally {
    MongoCustomClient.close();
  }
};

const getUserEvent = async (req: Request, res: Response) => {
  try {
    const events = await getUserEventDB(
      req.params.userID,
      req.params.eventID
    );

    res.status(200).send({
      events,
    });
  } catch (err) {
    const { name } = err as Error | BaseErr;

    if (name === ErrorTypes.BaseError) {
      const { message, statusCode } = err as BaseErr;
      if (statusCode) res.status(statusCode).json({ message });
    } else res.status(500).json({ message: 'Something went wrong' });
  } finally {
    MongoCustomClient.close();
  }
};

const add = async (req: Request, res: Response) => {
  try {
    await addEventDB(req.params.userID, req.body);

    res.status(200).send({
      message: 'Event added',
    });
  } catch (err) {
    const { name } = err as Error | BaseErr;

    if (name === ErrorTypes.BaseError) {
      const { message, statusCode } = err as BaseErr;
      if (statusCode) res.status(statusCode).json({ message });
    } else res.status(500).json({ message: 'Something went wrong' });
  } finally {
    MongoCustomClient.close();
  }
};

const deleteEvent = async (req: Request, res: Response) => {
  try {
    await deleteEventDB(req.params.userID, req.params.eventID);

    res.status(200).send({
      message: 'Event deleted',
    });
  } catch (err) {
    const { name } = err as Error | BaseErr;

    if (name === ErrorTypes.BaseError) {
      const { message, statusCode } = err as BaseErr;
      if (statusCode) res.status(statusCode).json({ message });
    } else res.status(500).json({ message: 'Something went wrong' });
  } finally {
    MongoCustomClient.close();
  }
};

export default {
  add,
  getEventsAll,
  getUserEventsAll,
  getUserEvent,
  deleteEvent,
};
