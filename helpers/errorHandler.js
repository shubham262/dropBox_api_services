export const apiErrorHandler = (res, error) => {
	if (error.name === 'ValidationError') {
		return res.status(400).json({
			success: false,
			message: 'Validation error',
			errors: error.errors,
		});
	}

	// Handle other types of errors
	return res.status(500).json({
		success: false,
		message: 'Internal Server Error',
		error: error,
	});
};
