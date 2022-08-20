import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { User } from '../models';
import { User as IUser } from '../types/user';

const signUp = (req: Request, res: Response) => {
  const user = new User({
    ...(req.body as IUser),
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((error, user) => {
    if (error) {
      return res.status(500).send({ message: error });
    }

    res.send(user);
  })
};

const signIn = (req: Request, res: Response) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (error) {
      return res.status(500).send({ message: error });
    }

    if (!user) {
      return res.status(404).send({ message: 'User not found, check the entered data again!' });
    }

    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Provided password is not correct!' });
    }

    res.status(200).send({ user, token: jwt.sign({ id: user._id }, process.env.JWT_SECRET as jwt.Secret) });
  });
};

export {
  signUp,
  signIn,
};
