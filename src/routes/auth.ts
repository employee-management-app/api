import { Router } from 'express';

import { acceptInvitation, signIn, signUp } from '../controllers/auth';
import { verifySignUp } from '../middlewares/verifySignUp';

export default (router: Router) => {
  router.post('/auth/signup', [verifySignUp], signUp);
  router.post('/auth/signin', signIn);
  router.post('/auth/invitation', acceptInvitation);
};
