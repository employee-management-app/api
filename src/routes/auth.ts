import { Router } from 'express';

import { acceptInvitation, getCurrentUser, signIn } from '../controllers/auth';
import { verifyToken } from '../middlewares/verifyToken';

export default (router: Router) => {
  router.post('/auth/signin', signIn);
  router.post('/auth/invitation', acceptInvitation);
  router.get('/auth/user', [verifyToken], getCurrentUser);
};
