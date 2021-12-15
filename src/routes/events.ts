import { Router } from 'express';

const router = Router();

import authenticate from '../middlewares/authenticate';
import validateEvent from '../middlewares/validateEvent';
import checkEventKeys from '../middlewares/checkEventKeys';

import eventsControllers from '../controllers/events';

router.get('/events/all', eventsControllers.getEventsAll);

router.get(
  '/events/:userID/all',
  authenticate,
  eventsControllers.getUserEventsAll
);

router.get(
  '/events/:userID/:eventID',
  authenticate,
  eventsControllers.getUserEvent
);

router.post(
  '/events/:userID',
  [authenticate, checkEventKeys, validateEvent],
  eventsControllers.add
);

router.delete(
  '/events/:userID/:eventID',
  authenticate,
  eventsControllers.deleteEvent
);

router.patch(
  '/events/:userID/:eventID',
  [authenticate, checkEventKeys],
  eventsControllers.updateEvent
);

router.post(
  '/events/:userID/:eventID/sign',
  [authenticate],
  eventsControllers.signUpEvent
);

router.post(
  '/events/:userID/:eventID/signOut',
  [authenticate],
  eventsControllers.signOutEvent
);

export = router;
