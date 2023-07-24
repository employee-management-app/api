import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { sendEmail } from '../helpers/sendEmail';
import { User } from '../models';

export const inviteManager = (req: Request, res: Response) => {
  const companyId = req.body.companyId ?? res.locals.companyId;

  User.create({ ...req.body, companyId, role: 'manager' })
    .then(async (data) => {
      const token = jwt.sign({ id: data._id, companyId }, process.env.JWT_SECRET as jwt.Secret, { expiresIn: '24h' });

      await sendEmail({
        to: req.body.email,
        subject: 'Employee management system - invitation',
        html: `
          <h3>Hey ${req.body.name}, you have been invited to work together in the employee management system!</h3>
          <p>Click the button below to complete your registration</p>
          <a href="${process.env.CLIENT_URL}/invitation/${token}" style="display: inline-block; text-decoration: none; background: #1352a1; color: #ffffff; padding: 8px 14px; border-radius: 4px;">Complete registration</a>
        `
      });

      res.send(data);
    })
    .catch((error) => {
      if (error.code === 11000) {
        return res.status(400).send({ message: 'The user already exists' });
      }

      return res.status(500).send(error);
    });
};
