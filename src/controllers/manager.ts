import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { sendEmail } from '../helpers/sendEmail';
import { User } from '../models';

export const inviteManager = (req: Request, res: Response) => {
  const { isOwner = false, ...body } = req.body;
  const companyId = body.companyId ?? res.locals.companyId;

  User.create({ ...body, companyId, role: isOwner ? 'owner' : 'manager' })
    .then(async (data) => {
      const token = jwt.sign({ id: data._id, companyId }, process.env.JWT_SECRET as jwt.Secret, { expiresIn: '24h' });

      await sendEmail({
        to: body.email,
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

export const updateManager = (req: Request, res: Response) => {
  const { isOwner, ...body } = req.body;

  User.findByIdAndUpdate(req.params.id, { ...body, role: isOwner ? 'owner' : 'manager' }, { new: true }).exec((error, user) => {
    if (error) {
      return res.status(500).send(error);
    }

    res.send(user);
  });
};
