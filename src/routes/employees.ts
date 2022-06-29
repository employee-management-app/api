import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken';
import { getEmployees } from '../controllers/employees';

export default (router: Router) => {
  router.get('/employees', [verifyToken], getEmployees);
};
