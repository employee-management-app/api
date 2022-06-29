import { Router } from 'express';

import { createOrder, updateOrder, deleteOrder } from '../controllers/order';
import { verifyToken } from '../middlewares/verifyToken';

export default (router: Router) => {
  router.post('/order', [verifyToken], createOrder);
  router.patch('/order/:id', [verifyToken], updateOrder);
  router.delete('/order/:id', [verifyToken], deleteOrder);
};
