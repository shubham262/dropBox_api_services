// Create new Agents

import validator from 'validator';
import {
	createNewAgentService,
	getAllAgents,
} from '../services/agentService.js';
const createNewSupportingAgent = async (req, res, next) => {
	try {
		const { name, email, phone } = req.body;

		if (!name?.length || !email?.length || !phone?.length) {
			return res.status(400).json({
				success: false,
				message: 'Please Enter valid name,email and phone values',
			});
		}

		if (!validator.isEmail(email)) {
			return res.status(400).json({
				success: false,
				message: 'Please Enter valid email id.',
			});
		}
		if (phone?.length !== 10) {
			return res.status(400).json({
				success: false,
				message: 'Please Enter valid phoneNumber',
			});
		}

		const agentData = await createNewAgentService({ ...req.body });

		res.status(201).json({
			success: true,
			agentData,
		});
	} catch (error) {
		if (error.name === 'ValidationError') {
			return res.status(400).json({
				success: false,
				message: 'Validation error',
				errors: error.errors,
			});
		}

		// Handle other types of errors
		return res.status(500).json({
			success: false,
			message: 'Internal Server Error',
			error: error,
		});
	}
};

const getAllSupportingAgent = async (req, res, next) => {
	try {
		const agentData = await getAllAgents();

		res.status(201).json({
			success: true,
			agentData,
		});
	} catch (error) {
		if (error.name === 'ValidationError') {
			return res.status(400).json({
				success: false,
				message: 'Validation error',
				errors: error.errors,
			});
		}

		// Handle other types of errors
		return res.status(500).json({
			success: false,
			message: 'Internal Server Error',
			error: error,
		});
	}
};

export { createNewSupportingAgent, getAllSupportingAgent };
