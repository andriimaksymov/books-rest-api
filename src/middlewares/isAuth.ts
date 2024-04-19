import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!process.env.JWT_SECRET) {
    throw new Error('Internal Server Error');
  }

  if (!token) {
		return res.status(401).json({ message: 'Not authenticated!' })
  }

  try {
    (req as CustomRequest).token = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    next(err);
  }
};

export default isAuth;
