import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import { AgentsRoute } from './routes/agentRoute.js';
import { TicketRoute } from './routes/ticketRoute.js';
const app = express();

//connecting to database
connectDatabase();

app.use(express.json());
app.use('/api', AgentsRoute);
app.use('/api', TicketRoute);

app.listen(3000, () => console.log('server started at port 3000'));
