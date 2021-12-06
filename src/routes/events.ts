import { Router } from 'express';

const router = Router();

import authenticate from '../middlewares/authenticate';
import validateEvent from '../middlewares/validateEvent';

import eventsControllers from '../controllers/events';

router.post(
  '/event/create',
  [authenticate, validateEvent],
  eventsControllers.add
);
