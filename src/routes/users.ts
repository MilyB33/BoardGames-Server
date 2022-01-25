import { Router } from 'express';

import usersControllers from '../controllers/users';
import authenticate from '../middlewares/authenticate';

const router = Router();

router.get('/all', usersControllers.getUsers);

router.get('/:userID', authenticate, usersControllers.getUserInfo);

router.delete('/:userID', authenticate, usersControllers.deleteUser);

router.patch(
  '/:userID/password',
  authenticate,
  usersControllers.updatePassword
);

router.post(
  '/:userID/friends/:friendID/request',
  authenticate,
  usersControllers.sendFriendsRequest
);

router.post(
  '/:userID/friends/:friendID/accept',
  authenticate,
  usersControllers.acceptFriendsRequest
);

router.delete(
  '/:userID/friends/:friendID/request',
  authenticate,
  usersControllers.rejectFriendsRequest
);

router.delete(
  '/:userID/friends/:friendID',
  authenticate,
  usersControllers.deleteFriend
);

router.post(
  '/:userID/events/request',
  authenticate,
  usersControllers.eventsRequests
);

router.delete(
  '/:userID/events/request/:inviteId',
  authenticate,
  usersControllers.rejectEventRequest
);

router.post(
  '/:userID/events/request/:inviteId/accept',
  authenticate,
  usersControllers.acceptEventRequest
);

export = router;
