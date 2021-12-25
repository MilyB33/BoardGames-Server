import { Request, Response } from 'express';

import addEventDB from '../db/addEventDB';
import getEventsAllDB from '../db/getEventsAllDB';
import getEventsUserAllDB from '../db/getEventsUserAllDB';
import getUserEventDB from '../db/getUserEventDB';
import deleteEventDB from '../db/deleteEventDB';
import updateEventDB from '../db/updateEventDB';
import signUserForEvent from '../db/signUserForEvent';
import signOutUserforEvent from '../db/signOutUserForEvent';
import getUserSignedEventsDB from '../db/getUserSignedEventsDB';
import deleteUserEventDB from '../db/deleteUserEventDB';
import errorHelper from '../utils/errorHelper';

const getEventsAll = async (req: Request, res: Response) =>
  errorHelper(req, res, 'Something went wrong', async () => {
    const result = await getEventsAllDB();

    res.status(200).send({ message: 'Success', result });
  });

const getUserEventsAll = async (req: Request, res: Response) =>
  errorHelper(req, res, 'Something went wrong', async () => {
    const result = await getEventsUserAllDB(req.params.userID);

    res.status(200).send({ message: 'Success', result });
  });

const getUserEvent = async (req: Request, res: Response) =>
  errorHelper(req, res, 'Something went wrong', async () => {
    const result = await getUserEventDB(
      req.params.userID,
      req.params.eventID
    );

    res.status(200).send({ message: 'Success', result });
  });

const add = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong during added',
    async () => {
      const result = await addEventDB(
        req.params.userID,
        req.body.event
      );

      res.status(200).send({ message: 'Success', result });
    }
  );

const deleteEvent = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong during deleting',
    async () => {
      const result = await deleteEventDB(
        req.params.userID,
        req.params.eventID
      );

      res.status(200).send({ message: 'Success', result });
    }
  );

const updateEvent = async (req: Request, res: Response) =>
  errorHelper(req, res, 'Something went wrong', async () => {
    const result = await updateEventDB(
      req.params.userID,
      req.params.eventID,
      req.body.event
    );

    res.status(200).send({ message: 'Success', result });
  });

const signUpEvent = async (req: Request, res: Response) =>
  errorHelper(req, res, 'Something went wrong', async () => {
    const result = await signUserForEvent(
      req.params.userID,
      req.params.eventID
    );

    res.status(200).send({ message: 'Success', result });
  });

const signOutEvent = async (req: Request, res: Response) =>
  errorHelper(req, res, 'Something went wrong', async () => {
    const result = await signOutUserforEvent(
      req.params.userID,
      req.params.eventID
    );

    res.status(200).send({ message: 'Success', result });
  });

const getUserSignedEvents = async (req: Request, res: Response) =>
  errorHelper(req, res, 'Something went wrong', async () => {
    const result = await getUserSignedEventsDB(req.params.userID);

    res.status(200).send({ message: 'Success', result });
  });

const deleteUserEvent = async (req: Request, res: Response) =>
  errorHelper(req, res, 'Something went wrong', async () => {
    const result = await deleteUserEventDB(
      req.params.userID,
      req.params.eventID
    );

    res.status(200).send({ message: 'Success', result });
  });

export default {
  add,
  getEventsAll,
  getUserEventsAll,
  getUserEvent,
  deleteEvent,
  updateEvent,
  signUpEvent,
  signOutEvent,
  getUserSignedEvents,
  deleteUserEvent,
};
