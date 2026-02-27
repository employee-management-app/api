import { Router } from 'express';

import { createOrder, deleteOrder, getOrder, removeFile, updateOrder, uploadFile } from '../controllers/order';
import { verifyCompanyIdOrToken } from '../middlewares/verifyCompanyIdOrToken';
import { verifyToken } from '../middlewares/verifyToken';

export default (router: Router) => {
  router.get('/order/:id', [verifyToken], getOrder);
  router.post('/order', [verifyCompanyIdOrToken], createOrder);
  router.patch('/order/:id', [verifyToken], updateOrder);
  router.delete('/order/:id', [verifyToken], deleteOrder);
  router.post('/order/:id/file', [verifyToken], uploadFile);
  router.delete('/order/:id/file/:fileId', [verifyToken], removeFile);
};
