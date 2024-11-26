import axios from 'axios';

// Function to ping the /health route
const pingHealthRoute = () => {
	axios
		.get('https://dropbox-api-services.onrender.com/api/health')
		.then(() => console.log('Health route pinged successfully'))
		.catch((err) => console.error('Error pinging health route:', err));
};

// Schedule the ping every 90 seconds

export const initiateHealthPingMechanism = () => {
	setInterval(pingHealthRoute, 90000);
};
