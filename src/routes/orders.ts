import { Router } from 'express';

import { veryfyToken } from '../middlewares/veryfyToken';
import { getOrders } from '../controllers/orders';

export default (router: Router) => {
  router.get('/orders', [veryfyToken], getOrders);
};
