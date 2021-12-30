import { Router } from 'express';

import usersControllers from '../controllers/users';
import authenticate from '../middlewares/authenticate';
import checkUserData from '../middlewares/checkUserData';

const router = Router();

router.post('/login', checkUserData, usersControllers.login);

router.post('/register', checkUserData, usersControllers.register);

router.delete(
  '/users/:userID',
  authenticate,
  usersControllers.deleteUser
);

export = router;
