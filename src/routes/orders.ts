import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken';
import { getOrders } from '../controllers/orders';

export default (router: Router) => {
  router.get('/orders', [verifyToken], getOrders);
};
