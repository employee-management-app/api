import { Router } from 'express';

import { getManagers } from '../controllers/managers';
import { verifyToken } from '../middlewares/verifyToken';

export default (router: Router) => {
  router.get('/managers', [verifyToken], getManagers);
};
