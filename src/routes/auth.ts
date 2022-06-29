import { Router } from 'express';

import { verifySignUp } from '../middlewares/verifySignUp';
import { signUp, signIn } from '../controllers/auth';

export default (router: Router) => {
  router.post('/auth/signup', [verifySignUp], signUp);
  router.post('/auth/signin', signIn);
};
