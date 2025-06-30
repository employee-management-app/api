import { Router } from 'express';
import multer from 'multer';

import { createCompany, getCompanyEmployees, getCompanyManagers, getCurrentUserCompany, updateCompany } from '../controllers/company';
import { adminOnly } from '../middlewares/adminOnly';
import { verifyToken } from '../middlewares/verifyToken';

const upload = multer({ dest: '/tmp' });

export default (router: Router) => {
  router.post('/company', [verifyToken, adminOnly, upload.single('logo')], createCompany);
  router.put('/company/:id', [verifyToken, adminOnly], updateCompany);
  router.get('/company', [verifyToken], getCurrentUserCompany);
  router.get('/company/:id/employees', [verifyToken, adminOnly], getCompanyEmployees);
  router.get('/company/:id/managers', [verifyToken, adminOnly], getCompanyManagers);
};
