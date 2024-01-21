import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

import { sendEmail } from '../helpers/sendEmail';
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

export const resetPassword = (req: Request, res: Response) => {
  const { email } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found, check the entered data again!' });
      }

      if (!user.isActive) {
        return res.status(403).send({ message: 'Your account has been deactivated!' });
      }

      if (!user.isVerified) {
        return res.status(403).send({ message: 'Your account is inactive, confirm your email!' });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as jwt.Secret, { expiresIn: 86400 });
      const link = `${process.env.CLIENT_URL}/change-password?token=${token}`;

      sendEmail({
        to: email,
        subject: 'Employee management system - Reset password',
        html: `<p>Click <a href="${link}">here</a> to reset your password.</p>`,
      })
        .then(() => {
          res.send({ message: 'Check your email to reset the password' });
        })
        .catch((error) => {
          res.status(500).send(error);
        });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

export const changePassword = (req: Request, res: Response) => {
  const { token, password } = req.body;

  jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, (error: VerifyErrors | null, payload: any) => {
    if (error) {
      return res.status(400).send({ message: 'The activation link is invalid or expired' });
    }

    User.findById((payload as JwtPayload).id)
      .then(async (user) => {
        if (!user) {
          return res.status(404).send({ message: 'Account with this email is not found' });
        }

        user.set('password', bcrypt.hashSync(password, 8));
        await user.save();

        sendEmail({
          to: user.email,
          subject: 'Employee management system - Password changed',
          html: '<p>Your password has been changed successfully!</p>',
        })
          .then(() => {
            res.send(user.toJSON());
          })
          .catch((error) => {
            res.status(500).send(error);
          });
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  });
};
