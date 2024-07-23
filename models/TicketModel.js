import mongoose from 'mongoose';
import Agent from './AgentModel.js';

const ticketValidFields = {
	topic: true,
	description: true,
	dateCreated: true,
	severity: true,
	type: true,
	assignedTo: true,
	status: true,
	resolvedOn: true,
};
const ticketSchema = new mongoose.Schema({
	topic: {
		type: String,
		required: [true, 'Please provide a topic'],
		trim: true,
	},
	description: {
		type: String,
		trim: true,
	},
	dateCreated: {
		type: Date,
		default: Date.now,
	},
	severity: {
		type: String,
		enum: ['low', 'medium', 'high'],
		default: 'low',
	},
	type: {
		type: String,
		trim: true,
	},
	assignedTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: Agent, // Reference to the Agent model
	},
	status: {
		type: String,
		enum: ['new', 'assigned', 'resolved'],
		default: 'new',
	},
	resolvedOn: {
		type: Date,
		default: null,
	},
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export { Ticket, ticketValidFields };
