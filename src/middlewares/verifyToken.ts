import jwt, { VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.replace('Token ', '');
  
  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error: VerifyErrors | null) => {
    if (error) {
      return res.status(401).send({ message: 'Unathorized!' });
    }

    next();
  });
};
