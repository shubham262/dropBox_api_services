import mongoose from 'mongoose';
import validator from 'validator';

console.log('I am agent Modal');
const agentSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please Enter your name '],
		trim: true,
	},
	email: {
		type: String,
		required: [true, 'Please Enter your Email'],
		trim: true,
		unique: true,
		validate: [validator.isEmail, 'Please enter valid email'],
	},
	phone: {
		type: String,
		trim: true,
		validate: [validator.isMobilePhone, 'Please enter valid phoneNumber'],
	},
	description: {
		type: String,
		trim: true,
	},
	active: {
		type: Boolean,
		default: true,
	},
	dateCreated: {
		type: Date,
		default: Date.now,
	},
});

const Agent = mongoose.model('AgentsList', agentSchema);

export default Agent;
