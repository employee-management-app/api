import { v2 as cloudinary } from 'cloudinary';
import { Request, Response } from 'express';
// eslint-disable-next-line unicorn/prefer-node-protocol
import { unlink } from 'fs/promises';

import { User } from '../models';
import { Company } from '../models/company';

export const createCompany = (req: Request, res: Response) => {
  const { name } = req.body;
  const path = req.file?.path;

  if (!path) {
    Company.create({ name })
      .then((company) => {
        res.status(200).send(company);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } else {
    cloudinary.uploader.upload(path, { use_filename: true })
      .then((data) => {
        Company.create({ name, logo: data.secure_url })
          .then((company) => {
            res.status(200).send(company);
          })
          .catch((error) => {
            res.status(500).send(error);
          });
      })
      .catch((error) => {
        res.status(500).send(error);
      })
      .finally(() => {
        unlink(path);
      });
  }
};

export const updateCompany = (req: Request, res: Response) => {
  const { id: companyId } = req.params;
  const { name, canAddImages, requiredFields } = req.body;

  Company.findByIdAndUpdate(companyId, { name, canAddImages, requiredFields }, { new: true })
    .then((company) => {
      res.send(company);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

export const getCurrentUserCompany = (req: Request, res: Response) => {
  const { companyId } = res.locals;

  Company.findById(companyId)
    .then((company) => {
      if (!company) {
        return res.status(404).send({ message: 'Company was not found' });
      }

      res.send(company);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

export const getCompanyEmployees = (req: Request, res: Response) => {
  const { id: companyId } = req.params;

  User.find({ companyId, role: 'employee' }).exec((error, employees) => {
    if (error) {
      return res.status(500).send(error);
    }

    res.send(employees);
  });
};

export const getCompanyManagers = (req: Request, res: Response) => {
  const { id: companyId } = req.params;

  User.find({ companyId, role: { $in: ['manager', 'owner'] } }).exec((error, managers) => {
    if (error) {
      return res.status(500).send(error);
    }

    res.send(managers);
  });
};
