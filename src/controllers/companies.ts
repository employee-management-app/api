import { Request, Response } from 'express';

import { Company } from '../models/company';

const getCompanies = (req: Request, res: Response) => {
  Company.find({}).exec((error, companies) => {
    if (error) {
      return res.status(500).send(error);
    }

    res.send(companies);
  });
};

export {
  getCompanies,
};
