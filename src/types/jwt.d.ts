import { ObjectId } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

export interface ExtendedJwtPayload extends JwtPayload {
  email?: string;
  userId: ObjectId
}