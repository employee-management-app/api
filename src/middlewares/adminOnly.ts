import { NextFunction, Request, Response } from 'express';

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const { user } = res.locals;

  if (user.role !== 'admin') {
    return res.status(403).send({ message: 'You do not have permissions to perform this action' });
  }

  next();
};
