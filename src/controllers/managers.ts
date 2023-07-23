import { Request, Response } from 'express';

import { User } from '../models';

const getManagers = (req: Request, res: Response) => {
  const { companyId } = res.locals;

  User.find({ ...req.query, companyId, role: 'manager' }).exec((error, employees) => {
    if (error) {
      return res.status(500).send(error);
    }

    res.send(employees);
  });
};

export {
  getManagers,
};
