import { Router } from 'express';

import usersControllers from '../controllers/users';
import authenticate from '../middlewares/authenticate';
import checkUserData from '../middlewares/checkUserData';

const router = Router();

router.get('/users/all', usersControllers.getUsers);

router.post('/login', checkUserData, usersControllers.login);

router.post('/register', checkUserData, usersControllers.register);

router.delete(
  '/users/:userID',
  authenticate,
  usersControllers.deleteUser
);

router.patch(
  '/users/:userID/password',
  authenticate,
  usersControllers.updatePassword
);

router.post(
  '/users/:userID/friends/:friendID/request',
  authenticate,
  usersControllers.sendFriendsRequest
);

router.post(
  '/users/:userID/friends/:friendID/accept',
  authenticate,
  usersControllers.acceptFriendsRequest
);

router.delete(
  '/users/:userID/friends/:friendID/request',
  authenticate,
  usersControllers.rejectFriendsRequest
);

router.delete(
  '/users/:userID/friends/:friendID',
  authenticate,
  usersControllers.deleteFriend
);

router.post(
  '/users/:userID/events/request',
  authenticate,
  usersControllers.eventsRequests
);

router.delete(
  '/users/:userID/events/request',
  authenticate,
  usersControllers.rejectEventRequest
);

export = router;
