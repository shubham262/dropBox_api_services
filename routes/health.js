import express from 'express';
import { healthController } from '../controllers/healthControllers.js';
const router = express.Router();

router.route('/health').get(healthController);

export const healthRoute = router;
