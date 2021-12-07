import { Router } from 'express';

const router = Router();

import authenticate from '../middlewares/authenticate';
import validateEvent from '../middlewares/validateEvent';

import eventsControllers from '../controllers/events';

router.get('/event/all', eventsControllers.getEventsAll);

router.get(
  '/event/:userID/all',
  authenticate,
  eventsControllers.getUserEventsAll
);

router.get(
  '/event/:userID/:eventID',
  authenticate,
  eventsControllers.getUserEvent
);

router.post(
  '/event/create',
  [authenticate, validateEvent],
  eventsControllers.add
);

router.delete(
  '/event/:userID/:eventID',
  authenticate,
  eventsControllers.deleteEvent
);

export = router;
