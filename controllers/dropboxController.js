import { apiErrorHandler } from '../helpers/errorHandler.js';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { client } from '../config/elasticConfig.js';

export const dropBoxAuthentication = async (req, res, next) => {
	try {
		const DROPBOX_OAUTH_URL = process.env.DROPBOX_OAUTH_URL;
		const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID;
		const REDIRECT_URL = process.env.REDIRECT_URL;
		const authUrl = `${DROPBOX_OAUTH_URL}?client_id=${DROPBOX_CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=code`;

		res.status(200).json({ url: authUrl });
	} catch (error) {
		return apiErrorHandler(res, error);
	}
};

export const authorizeDropBoxUser = async (req, res, next) => {
	try {
		const { code } = req.query;
		if (!code) {
			return res.status(400).send('Authorization code is missing');
		}
		// Exchange authorization code for access token

		const DROPBOX_TOKEN_URL = process.env.DROPBOX_TOKEN_URL;
		const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID;
		const DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET;
		const REDIRECT_URL = process.env.REDIRECT_URL;
		const JWT_SECRET = process.env.JWT_SECRET;
		const response = await axios.post(
			DROPBOX_TOKEN_URL,
			new URLSearchParams({
				code,
				grant_type: 'authorization_code',
				client_id: DROPBOX_CLIENT_ID,
				client_secret: DROPBOX_CLIENT_SECRET,
				redirect_uri: REDIRECT_URL,
			}),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);
		const { access_token, expires_in, account_id } = response.data;
		// Generate a JWT for the frontend

		const token = jwt.sign(
			{
				accessToken: access_token,
				dropBoxExpiresIn: expires_in,
				userId: account_id,
				dropBoxTokenCreateAt: Date.now(),
			},
			JWT_SECRET,
			{
				expiresIn: '48h',
			}
		);
		res.redirect(
			`https://borneo-dashboard.vercel.app/drop-box-oauth?token=${token}`
		);
	} catch (error) {
		return apiErrorHandler(res, error);
	}
};

export const fetchUserDocuments = async (req, res) => {
	try {
		const decoded = req.user;
		const { accessToken, userId } = decoded;

		// Fetch documents from Dropbox
		const response = await axios.post(
			'https://api.dropboxapi.com/2/files/list_folder/',
			{
				path: '',
				limit: 1000,
			},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			}
		);

		//filter .txt and .docs documents
		const filteredFiles = response?.data?.entries?.filter(
			(file) =>
				file['.tag'] === 'file' &&
				(file.name.endsWith('.txt') || file.name.endsWith('.docs'))
		);
		let data = {
			...(response?.data || {}),
			entries: [...(filteredFiles || [])],
		};

		downloadFileFromDropbox(accessToken, data, userId);
		res.json(data);
	} catch (error) {
		console.error('Error fetching Dropbox documents:', error);
		res.status(500).send('Error fetching Dropbox documents');
	}
};

// Function to download file content from Dropbox
const downloadFileFromDropbox = async (accessToken, filesData, userId) => {
	const url = `https://content.dropboxapi.com/2/files/download`;
	const files = filesData?.entries || [];
	for (let i = 0; i < files.length; i++) {
		const headers = {
			Authorization: `Bearer ${accessToken}`,
			'Dropbox-API-Arg': JSON.stringify({
				path: files?.[i]?.id,
			}),
			Accept: '*/*',
			'Content-Type': 'text/plain',
		};
		try {
			const response = await axios.post(url, null, {
				headers,
			});
			const fileContent = await response.data.toString('utf-8');
			let obj = {
				userId: userId,
				fileName: files?.[i]?.name,
				content: fileContent,
				id: files?.[i]?.id,
				fileData: JSON.stringify(files?.[i]),
			};
			await indexDocument(obj);
		} catch (error) {
			console.error(`Error downloading file from Dropbox: `, error);
			return null;
		}
	}
};

const indexDocument = async (doc) => {
	try {
		const response = await client.index({
			index: 'user-documents',
			id: doc?.id,
			routing: doc?.userId,
			body: {
				fileName: doc?.fileName,
				content: doc?.content,
				fileId: doc?.id,
				timestamp: new Date(),
				fileData: doc?.fileData,
			},
		});
	} catch (error) {
		console.error('Error indexing document:', error);
	}
};

// Function to search documents based on userId and keywords
export const searchDocuments = async (req, res, next) => {
	const { query } = req.query;

	const decoded = req.user;
	const { accessToken, userId } = decoded;

	const response = await client.search({
		index: 'user-documents',
		routing: userId,
		body: {
			query: {
				match: {
					content: query,
				},
			},
		},
	});
	const modifiedResponse = {
		userId: userId,
		data: response?.hits?.hits?.map((ele, index) => ele?._source),
	};

	return res.status(200).json(modifiedResponse);
};

//delete function
export const clearIndexDocuments = async (req, res, next) => {
	try {
		const response = await client.deleteByQuery({
			index: 'user-documents',
			body: {
				query: {
					match_all: {}, // Matches all documents in the index
				},
			},
		});
		return res.status(200).json(response);
	} catch (error) {
		console.error('Error deleting documents:', error);
	}
};
