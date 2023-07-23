import { Router } from 'express';

import { getCompanies } from '../controllers/companies';
import { adminOnly } from '../middlewares/adminOnly';
import { verifyToken } from '../middlewares/verifyToken';

export default (router: Router) => {
  router.get('/companies', [verifyToken, adminOnly], getCompanies);
};
