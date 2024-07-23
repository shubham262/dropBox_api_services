import { Ticket } from '../models/TicketModel.js';
const createNewTickets = async (data) => {
	try {
		const agentData = await Ticket.create({
			...data,
		});

		return agentData;
	} catch (error) {
		throw error;
	}
};
const getAllTickets = async (data) => {
	try {
		let { page, limit, filters, sortBy } = data;
		const skip = (page - 1) * limit;

		//for queries
		const query = {};
		const sortOptions = {};

		if (filters && filters?.assignedTo) {
			query.assignedTo = filters.assignedTo;
		}
		if (sortBy) {
			console.log('sortBY', sortBy);
			//dateCreated //resolvedOn
			sortOptions[sortBy] = 1; // 1 for ascending, -1 for descending
		}
		const allTickets = await Ticket.find(query)
			.skip(skip)
			.limit(limit)
			.sort(sortOptions);
		return allTickets;
	} catch (error) {
		throw error;
	}
};

const getAllAgentsTickets = async (agentId) => {
	try {
		const tickets = await Ticket.find({ assignedTo: agentId }).populate(
			'assignedTo'
		);

		return tickets;
	} catch (error) {
		throw error;
	}
};
export { createNewTickets, getAllTickets, getAllAgentsTickets };
