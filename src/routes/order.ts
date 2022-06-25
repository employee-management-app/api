import { Router } from 'express';

import { createOrder, updateOrder, deleteOrder } from '../controllers/order';
import { veryfyToken } from '../middlewares/veryfyToken';

export default (router: Router) => {
  router.post('/order', [veryfyToken], createOrder);
  router.patch('/order/:id', [veryfyToken], updateOrder);
  router.delete('/order/:id', [veryfyToken], deleteOrder);
};
