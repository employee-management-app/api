import { NextFunction, Request, Response } from 'express';

import { Company } from '../models/company';
import { verifyToken } from './verifyToken';

export const verifyCompanyIdOrToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.replace('Token ', '');
  const { companyId } = req.body;

  if (!token && !companyId) {
    return res.status(403).send({ message: 'No token or company id provided!' });
  }

  if (!companyId) {
    return verifyToken(req, res, next);
  }

  Company.findById(companyId)
    .then((company) => {
      if (!company) {
        return res.status(404).send({ message: 'Company with provided id doesn\'t exist' });
      }

      res.locals.companyId = companyId;

      next();
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};
