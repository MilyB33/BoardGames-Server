import { Router } from 'express';

import usersControllers from '../controllers/users';

const router = Router();

router.post('/login', usersControllers.login);
router.post('/register', usersControllers.register);

export = router;
