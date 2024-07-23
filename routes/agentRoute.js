import express from 'express';
import {
	createNewSupportingAgent,
	getAllSupportingAgent,
} from '../controllers/agentController.js';
const router = express.Router();

router.route('/support-agents').post(createNewSupportingAgent);
router.route('/get-all-support-agents').get(getAllSupportingAgent);

export const AgentsRoute = router;
