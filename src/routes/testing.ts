import { Router } from 'express';
import controllers from '../controllers/testing';

const router = Router();

router.get('/testing', controllers.testing);

export = router;
