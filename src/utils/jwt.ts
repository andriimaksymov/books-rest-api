import jwt from 'jsonwebtoken';

import { ExtendedJwtPayload } from '../types/jwt';

export function verifyToken(token: string, secretKey: string): Promise<ExtendedJwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as ExtendedJwtPayload);
      }
    });
  });
}