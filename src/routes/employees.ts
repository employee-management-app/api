import { Router } from 'express';

import { veryfyToken } from '../middlewares/veryfyToken';
import { getEmployees } from '../controllers/employees';

export default (router: Router) => {
  router.get('/employees', [veryfyToken], getEmployees);
};
