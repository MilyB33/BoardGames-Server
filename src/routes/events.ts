import { Router } from 'express';

const router = Router();

import authenticate from '../middlewares/authenticate';
import validateEvent from '../middlewares/validateEvent';
import checkEventKeys from '../middlewares/checkEventKeys';

import eventsControllers from '../controllers/events';

router.get('/all/', eventsControllers.getEventsAll);

router.get(
  '/:userID/all',
  authenticate,
  eventsControllers.getUserEventsAll
);

router.get(
  '/:userID/:eventID',
  authenticate,
  eventsControllers.getUserEvent
);

router.get(
  '/:userID/signed/all',
  authenticate,
  eventsControllers.getUserSignedEvents
);

router.post(
  '/:userID',
  [authenticate, checkEventKeys, validateEvent],
  eventsControllers.add
);

router.delete(
  '/:userID/:eventID',
  authenticate,
  eventsControllers.deleteEvent
);

router.patch(
  '/:userID/:eventID',
  [authenticate, checkEventKeys],
  eventsControllers.updateEvent
);

router.post(
  '/:userID/:eventID/sign',
  [authenticate],
  eventsControllers.signUpEvent
);

router.post(
  '/:userID/:eventID/signOut',
  [authenticate],
  eventsControllers.signOutEvent
);

router.delete(
  '/:userID/:eventID',
  [authenticate],
  eventsControllers.deleteUserEvent
);

export = router;
