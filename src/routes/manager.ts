import { Router } from 'express';

import { inviteManager, updateManager } from '../controllers/manager';
import { verifyToken } from '../middlewares/verifyToken';

export default (router: Router) => {
  router.post('/manager', [verifyToken], inviteManager);
  router.patch('/manager/:id', [verifyToken], updateManager);
};
