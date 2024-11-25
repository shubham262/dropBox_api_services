import express from 'express';
import {
	authorizeDropBoxUser,
	clearIndexDocuments,
	dropBoxAuthentication,
	fetchUserDocuments,
	searchDocuments,
} from '../controllers/dropboxController.js';
import { checkAuthenticated } from '../middleware/index.js';

const router = express.Router();

router.route('/dropbox').get(dropBoxAuthentication);
router.route('/dropbox/redirect').get(authorizeDropBoxUser);
router.route('/dropbox-documents').get(checkAuthenticated, fetchUserDocuments);
router
	.route('/dropbox-seacrch-documents')
	.get(checkAuthenticated, searchDocuments);

router
	.route('/remove-dropbox-documents')
	.delete(checkAuthenticated, clearIndexDocuments);
export const dropboxRoute = router;
