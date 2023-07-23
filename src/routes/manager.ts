import { Router } from 'express';

import { inviteManager } from '../controllers/manager';
import { verifyToken } from '../middlewares/verifyToken';

export default (router: Router) => {
  router.post('/manager', [verifyToken], inviteManager);
};
