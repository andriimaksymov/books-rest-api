import { JwtPayload } from 'jsonwebtoken';

export interface ExtendedJwtPayload extends JwtPayload {
  user_id: string
}