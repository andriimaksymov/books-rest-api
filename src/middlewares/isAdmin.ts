import { NextFunction, Request, Response } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

import { ExtendedJwtPayload } from '../types/jwt';
import UserModel from '../v1/models/user.model';

// Middleware to check if user is an admin
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
	// Extract token from Authorization header
	const token = req.header('Authorization')?.replace('Bearer ', '');

	// Check if JWT_SECRET is defined in environment variables
	if (!process.env.JWT_SECRET) {
		throw new Error('Internal Server Error');
	}

	if (!token) {
		return res.status(401).json({ message: 'Not authenticated!' })
	}

	let data: ExtendedJwtPayload;

	try {
		// Verify and decode the token
		data = await jwt.verify(token, process.env.JWT_SECRET) as ExtendedJwtPayload;
		// Token is valid, continue with your logic
	} catch (err) {
		if (err instanceof TokenExpiredError) {
			// Token has expired
			return res.status(401).json({ error: 'Token expired' });
		} else if (err instanceof jwt.JsonWebTokenError) {
			// Other JWT verification errors
			return res.status(401).json({ error: 'Invalid token' });
		} else {
			// Unexpected errors
			return res.status(500).json({ error: 'Internal server error' });
		}
	}

	try {
		// Find user by user_id extracted from the token
		const user = await UserModel.findById(data.user_id);
		// Check if user exists and is an admin
		if (user && user.role === 'admin') {
			next(); // User is an admin, proceed to next middleware
		} else {
			res.status(403).send('Forbidden'); // User is not an admin, send forbidden error
		}
	} catch (err) {
		next(err); // Forward error to error handler middleware
	}
};

export default isAdmin;
