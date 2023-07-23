import { NextFunction, Request, Response } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';

import { User } from '../models';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.replace('Token ', '');

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, (error: VerifyErrors | null, payload: any) => {
    if (error) {
      return res.status(401).send({ message: 'Unathorized!' });
    }

    const { id: userId, companyId } = payload as jwt.JwtPayload;

    User.findById(userId).exec((error, user) => {
      if (error) {
        return res.status(500).send(error);
      }

      if (!user?.isActive || !user.isVerified) {
        return res.status(403).send({ message: 'Your account is inactive' });
      }

      res.locals.user = user;
      res.locals.companyId = companyId;

      next();
    });
  });
};
