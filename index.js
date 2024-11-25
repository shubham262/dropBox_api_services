import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDatabase } from './config/database.js';
import { dropboxRoute } from './routes/dropBoxRoute.js';
import { createElasticClient } from './config/elasticConfig.js';

dotenv.config();
const app = express();

//connecting to database
createElasticClient();
connectDatabase();
app.use(cors());

app.use(express.json());
app.use('/api', dropboxRoute);

app.listen(process.env.PORT || 3000, () =>
	console.log('server started at port 3000')
);
