import { Router } from 'express';

import { veryfySignUp } from '../middlewares/veryfySignUp';
import { signUp, signIn } from '../controllers/auth';

export default (router: Router) => {
  router.post('/auth/signup', [veryfySignUp], signUp);
  router.post('/auth/signin', signIn);
};
