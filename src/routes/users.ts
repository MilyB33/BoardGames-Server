import { Router } from 'express';

import usersControllers from '../controllers/users';
import checkUserData from '../middlewares/checkUserData';

const router = Router();

router.post('/login', usersControllers.login);
router.post('/register', checkUserData, usersControllers.register);

export = router;
