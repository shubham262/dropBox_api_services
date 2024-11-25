// const { Client } = require('@elastic/elasticsearch');
import { Client } from '@elastic/elasticsearch';
let client;

const createElasticClient = () => {
	const CLOUDID = process.env.CLOUDID;
	const USERNAME = process.env.USERNAME;
	const PASSWORD = process.env.PASSWORD;
	const NODEID = process.env.NODEID;
	client = new Client({
		cloud: {
			id: CLOUDID,
		},
		node: NODEID,
		auth: {
			username: USERNAME,
			password: PASSWORD,
		},
	});
};

export { client, createElasticClient };
