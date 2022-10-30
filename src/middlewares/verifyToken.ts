import { NextFunction, Request, Response } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.replace('Token ', '');

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, (error: VerifyErrors | null) => {
    if (error) {
      return res.status(401).send({ message: 'Unathorized!' });
    }

    next();
  });
};
