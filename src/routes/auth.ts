import { Router } from 'express';
import authControllers from '../controllers/auth';
import checkUserData from '../middlewares/checkUserData';

const router = Router();

router.post('/login', checkUserData, authControllers.login);

router.post('/register', checkUserData, authControllers.register);

export = router;
