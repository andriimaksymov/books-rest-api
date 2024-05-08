import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

import { ExtendedJwtPayload } from '../types/jwt';
import { verifyToken } from '../utils/jwt';

export interface ExtendedRequest extends Request {
  token: string | ExtendedJwtPayload;
}

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!process.env.JWT_SECRET) {
    throw new Error('Internal Server Error');
  }

  if (!token) {
		return res.status(401).json({ message: 'Not authenticated!' })
  }

  try {
    (req as ExtendedRequest).token = await verifyToken(token, process.env.JWT_SECRET);
    next();
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
};

export default isAuth;
