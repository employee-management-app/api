import { Router } from 'express';

import { getOrders, getSlots } from '../controllers/orders';
import { verifyToken } from '../middlewares/verifyToken';

export default (router: Router) => {
  router.get('/orders', [verifyToken], getOrders);
  router.get('/slots', [verifyToken], getSlots);
};
