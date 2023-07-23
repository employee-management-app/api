import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models';
import { Company } from '../models/company';

export const signIn = (req: Request, res: Response) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (error) {
      return res.status(500).send(error);
    }

    if (!user) {
      return res.status(404).send({ message: 'User not found, check the entered data again!' });
    }

    if (!user.isActive) {
      return res.status(403).send({ message: 'Your account has been deactivated!' });
    }

    if (!user.isVerified) {
      return res.status(403).send({ message: 'Your account is inactive, confirm your email!' });
    }

    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Provided password is not correct!' });
    }

    res.status(200).send({ user, token: jwt.sign({ id: user._id, companyId: user.companyId }, process.env.JWT_SECRET as jwt.Secret) });
  });
};

export const acceptInvitation = (req: Request, res: Response) => {
  jwt.verify(req.body.token, process.env.JWT_SECRET as jwt.Secret, (error: jwt.VerifyErrors | null, payload: any) => {
    if (error) {
      return res.status(403).send({ message: 'Your invitation link has expired, please contact your manager.' });
    }

    User.findById((payload as jwt.JwtPayload).id).exec((error, user) => {
      if (error || !user) {
        return res.status(500).send(error);
      }

      if (!user.isActive) {
        return res.status(403).send({ message: 'Your account has been deactivated!' });
      }

      user.set('isVerified', true);
      user.set('password', bcrypt.hashSync(req.body.password, 8));
      user.save((error) => {
        if (error) {
          return res.status(500).send(error);
        }

        res.send({ message: 'User has been verified' });
      });
    });
  });
};

export const getCurrentUser = (req: Request, res: Response) => {
  const { user, companyId } = res.locals;

  Company.findById(companyId)
    .then((company) => {
      res.send({ company, user });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};
