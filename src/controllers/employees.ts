import { Request, Response } from 'express';

import { User } from '../models';

const getEmployees = (req: Request, res: Response) => {
  User.find({}).exec((err, orders) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    res.send(orders);
  });
};

export {
  getEmployees,
};
