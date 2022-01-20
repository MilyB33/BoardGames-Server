import { Router } from 'express';
import controllers from '../controllers/testing';

const router = Router();

router.post('/testing', controllers.testing);

export = router;
