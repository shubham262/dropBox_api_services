import mongoose from 'mongoose';
let db;
const connectDatabase = () => {
	mongoose.connect('mongodb://localhost:27017/TicketEntry', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	db = mongoose.connection;

	db.on('error', (err) => {
		console.error('MongoDB connection error:', err);
	});

	db.once('open', () => {
		console.log('Connected to MongoDB');
	});

	db.on('disconnected', () => {
		console.log('Disconnected from MongoDB');
	});

	// Handle Node process termination to close the MongoDB connection
	process.on('SIGINT', () => {
		db.close();
		process.exit(0);
	});
	return db;
};

export { connectDatabase, db };
