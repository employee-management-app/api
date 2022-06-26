import jwt, { VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const veryfyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.replace('Token ', '');
  
  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: VerifyErrors | null) => {
    if (err) {
      res.status(401).send({ message: 'Unathorized!' });
    }

    next();
  });
};
