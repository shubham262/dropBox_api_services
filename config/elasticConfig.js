// const { Client } = require('@elastic/elasticsearch');
import { Client } from '@elastic/elasticsearch';
let client;

const createElasticClient = () => {
	client = new Client({
		cloud: {
			id: '5b61f5253a7f4f2d8d7502d1c11c778e:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJGVlOWIzMGJjOWM3NzRmZmJiOThhMThlM2FlYzZkMWY5JGRkNTE5YTliODNiYjQxNmNhMDYxMzkwN2ZmOGU4NDBk',
		},
		node: 'https://ee9b30bc9c774ffbb98a18e3aec6d1f9.us-central1.gcp.cloud.es.io:443',
		auth: {
			username: 'shubham',
			password: 'Ve@12345',
		},
	});
};

export { client, createElasticClient };
