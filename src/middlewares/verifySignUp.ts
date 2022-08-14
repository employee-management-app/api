import { Request, Response, NextFunction } from 'express';

import { User } from '../models';

export const verifySignUp = (req: Request, res: Response, next: NextFunction) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (error) {
      return res.status(500).send({ message: error });
    }

    if (user) {
      return res.status(400).send({ message: 'User with provided email already exists' });
    }

    next();
  });
};
