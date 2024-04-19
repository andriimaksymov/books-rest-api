import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { ExtendedJwtPayload } from '../types/jwt';
import UserModel from '../v1/models/user.model';

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.header('Authorization')?.replace('Bearer ', '');

	if (!process.env.JWT_SECRET) {
		throw new Error('Internal Server Error');
	}

	if (!token) {
		return res.status(401).json({ message: 'Not authenticated!' })
	}

	const data = jwt.verify(token, process.env.JWT_SECRET) as ExtendedJwtPayload;

	try {
		const user = await UserModel.findById(data.user_id);
		if (user && user.role === 'admin') {
			next();
		} else {
			res.status(403).send('Forbidden');
		}
	} catch (err) {
		next(err);
	}
};

export default isAdmin;
