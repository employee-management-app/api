import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { User } from '../models';
import { IUser } from '../models/user';

const signUp = (req: Request, res: Response) => {
  const user = new User({
    ...(req.body as IUser),
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    res.send(user);
  })
};

const signIn = (req: Request, res: Response) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    if (!user) {
      return res.status(404).send({ message: 'User not found, check the entered data again!' });
    }

    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Provided password is not correct!' });
    }

    req.session = { token: jwt.sign({ id: user._id }, process.env.JWT_SECRET!) };

    res.status(200).send(user);
  });
};

const signOut = (req: Request, res: Response) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

export {
  signUp,
  signIn,
  signOut,
};
