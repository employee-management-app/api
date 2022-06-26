import { Request, Response } from 'express';

import { User } from '../models';

const getEmployees = (req: Request, res: Response) => {
  User.find({ role: 'employee' }).exec((err, employees) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    res.send(employees);
  });
};

export {
  getEmployees,
};
