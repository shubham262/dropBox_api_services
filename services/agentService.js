import Agent from '../models/AgentModel.js';
const createNewAgentService = async (data) => {
	try {
		const { name, email, phone, description, active } = data;

		const agentWithGivenEmail = await Agent.find({ email });

		if (agentWithGivenEmail && agentWithGivenEmail?.length) {
			throw 'Agent with given Email Id already Exists';
		}

		const agentData = await Agent.create({
			name,
			email,
			phone,
			description,
			active: active || true,
		});

		return agentData;
	} catch (error) {
		throw error;
	}
};
const getAllAgents = async (data) => {
	try {
		const allAgents = await Agent.find();
		return allAgents;
	} catch (error) {
		throw error;
	}
};

export { createNewAgentService, getAllAgents };
