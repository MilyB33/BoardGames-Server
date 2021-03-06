import { Request, Response } from 'express';

import addEventDB from '../db/addEventDB';
import getEventsAllDB from '../db/getEventsAllDB';
import getEventsUserAllDB from '../db/getEventsUserAllDB';
import deleteEventDB from '../db/deleteEventDB';
import updateEventDB from '../db/updateEventDB';
import signUserForEvent from '../db/signUserForEvent';
import signOutUserforEvent from '../db/signOutUserForEvent';
import getUserSignedEventsDB from '../db/getUserSignedEventsDB';
import errorHelper from '../utils/errorHelper';

const getEventsAll = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong while getting events',
    async () => {
      const result = await getEventsAllDB(req.query);

      res.status(200).send({ message: 'Success', result });
    }
  );

const getUserEventsAll = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong while getting events',
    async () => {
      const result = await getEventsUserAllDB(
        req.params.userID,
        req.query
      );

      res.status(200).send({ message: 'Success', result });
    }
  );

const add = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong while adding event',
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
    'Something went wrong while deleting event',
    async () => {
      const result = await deleteEventDB(
        req.params.userID,
        req.params.eventID
      );

      res.status(200).send({ message: 'Success', result });
    }
  );

const updateEvent = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong while updating event',
    async () => {
      const result = await updateEventDB(
        req.params.userID,
        req.params.eventID,
        req.body.event
      );

      res.status(200).send({ message: 'Success', result });
    }
  );

const signUpEvent = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong while signing up for event',
    async () => {
      const result = await signUserForEvent(
        req.params.userID,
        req.params.eventID
      );

      res.status(200).send({ message: 'Success', result });
    }
  );

const signOutEvent = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong while signing out from event',
    async () => {
      const result = await signOutUserforEvent(
        req.params.userID,
        req.params.eventID
      );

      res.status(200).send({ message: 'Success', result });
    }
  );

const getUserSignedEvents = async (req: Request, res: Response) =>
  errorHelper(
    req,
    res,
    'Something went wrong while getting events',
    async () => {
      const result = await getUserSignedEventsDB(
        req.params.userID,
        req.query
      );

      res.status(200).send({ message: 'Success', result });
    }
  );

export default {
  add,
  getEventsAll,
  getUserEventsAll,
  deleteEvent,
  updateEvent,
  signUpEvent,
  signOutEvent,
  getUserSignedEvents,
};
