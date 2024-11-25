import jwt from 'jsonwebtoken';
export const checkAuthenticated = async (req, res, next) => {
	try {
		// Get token from headers
		const token = req.header('Authorization')?.replace('Bearer ', '');
		if (!token) {
			return res
				.status(401)
				.json({ message: 'No token provided, authorization denied' });
		}

		// Verify token
		const JWT_SECRET = process.env.JWT_SECRET;
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = decoded; // Attach user data to request object
		next();
	} catch (error) {
		return res.status(401).json({ message: 'Token is not valid' });
	}
};
