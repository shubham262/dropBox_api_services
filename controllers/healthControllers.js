import { apiErrorHandler } from '../helpers/errorHandler.js';
export const healthController = async (req, res, next) => {
	try {
		res.status(200).json({ message: 'Healthy' });
	} catch (error) {
		return apiErrorHandler(res, error);
	}
};
