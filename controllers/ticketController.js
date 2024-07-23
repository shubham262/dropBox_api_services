import {
	createNewTickets,
	getAllTickets,
	getAllAgentsTickets,
} from '../services/ticketService.js';
import { ticketValidFields } from '../models/TicketModel.js';

const getAllSupportingTickets = async (req, res, next) => {
	try {
		const { page, limit, filters, sortBy } = req?.query;

		if (!page || !limit || !+page || !+limit) {
			return res.status(400).json({
				success: false,
				message: 'Page and limit values are mandatory',
			});
		}
		const requestObject = {
			page: +page,
			limit: +limit,
			filters: filters?.length ? JSON.parse(filters) : null,
			sortBy: sortBy?.length ? sortBy : null,
		};

		const ticketsData = await getAllTickets(requestObject);
		res.status(201).json({
			success: true,
			ticketsData,
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

const createNewSupportingTickets = async (req, res, next) => {
	try {
		const requestObject = req.body;
		const { topic } = requestObject;
		if (!topic?.length) {
			return res.status(400).json({
				success: false,
				message: 'Please Enter valid ticket topic',
			});
		}
		for (const key in requestObject) {
			if (!ticketValidFields?.[key]) {
				delete requestObject?.[key];
			}
		}

		const createResponse = await createNewTickets(requestObject);

		res.status(201).json({
			success: true,
			createResponse,
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

const getAllAssociatedTickets = async (req, res, next) => {
	try {
		const { agentId } = req.body;

		if (!agentId || !agentId?.length) {
			return res.status(400).json({
				success: false,
				message: 'Please Enter valid AgentID',
			});
		}

		const agentData = await getAllAgentsTickets(agentId);

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

export {
	createNewSupportingTickets,
	getAllSupportingTickets,
	getAllAssociatedTickets,
};
