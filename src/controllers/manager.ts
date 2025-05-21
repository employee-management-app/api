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
        subject: 'Potwierdzenie założenia konta w aplikacji Technik w Terenie',
        html: `
          <p>Dzień dobry,</p>
          <p>założono dla Ciebie konto w aplikacji Technik w Terenie. Aby dokończyć proces rejestracji i ustalić hasło do Twojego konta kliknij w poniższy link: <br/>
            <a href="${process.env.CLIENT_URL}/invitation/${token}">${process.env.CLIENT_URL}/invitation/${token}</a>
          </p>
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
