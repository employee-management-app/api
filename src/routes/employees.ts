import { Router } from 'express';

import { getEmployees } from '../controllers/employees';
import { verifyToken } from '../middlewares/verifyToken';

export default (router: Router) => {
  router.get('/employees', [verifyToken], getEmployees);
};
