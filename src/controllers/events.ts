import { Request, Response } from 'express';

import addEventDB from '../db/addEventDB';
import getEventsAllDB from '../db/getEventsAllDB';
import getEventsUserAllDB from '../db/getEventsUserAllDB';
import getUserEventDB from '../db/getUserEventDB';
import deleteEventDB from '../db/deleteEventDB';
import updateEventDB from '../db/updateEventDB';
import errorHelper from '../utils/errorHelper';

const getEventsAll = async (req: Request, res: Response) =>
  errorHelper(req, res, 'Something went wrong', async () => {
    const events = await getEventsAllDB();

    res.status(200).send({
      events,
    });
  });

const getUserEventsAll = async (req: Request, res: Response) =>
  errorHelper(req, res, 'Something went wrong', async () => {
    const events = await getEventsUserAllDB(req.params.userID);

    res.status(200).send({
      events,
    });
  });

const getUserEvent = async (req: Request, res: Response) =>
  errorHelper(req, res, 'Something went wrong', async () => {
    const events = await getUserEventDB(
      req.params.userID,
      req.params.eventID
    );

    res.status(200).send({
      events,
    });
  });

const add = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong during added',
    async () => {
      const events = await addEventDB(req.params.userID, req.body);

      res.status(200).send({
        events,
      });
    }
  );

const deleteEvent = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong during deleting',
    async () => {
      const events = await deleteEventDB(
        req.params.userID,
        req.params.eventID
      );

      res.status(200).send({
        events,
      });
    }
  );

const updateEvent = async (req: Request, res: Response) =>
  errorHelper(req, res, 'Something went wrong', async () => {
    const events = await updateEventDB(
      req.params.userID,
      req.params.eventID,
      req.body
    );

    res.status(200).send({
      events,
    });
  });

export default {
  add,
  getEventsAll,
  getUserEventsAll,
  getUserEvent,
  deleteEvent,
  updateEvent,
};
