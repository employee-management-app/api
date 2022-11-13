import { Request, Response } from 'express';

import { User } from '../models';

const getEmployees = (req: Request, res: Response) => {
  User.find({ role: 'employee', ...req.query }).exec((error, employees) => {
    if (error) {
      return res.status(500).send(error);
    }

    res.send(employees);
  });
};

export {
  getEmployees,
};
