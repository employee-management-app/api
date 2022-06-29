import { Router } from 'express';

import { getEmployeeOrders } from '../controllers/employee';
import { verifyToken } from '../middlewares/verifyToken';

export default (router: Router) => {
  router.get('/employee/:id/orders', [verifyToken], getEmployeeOrders);
};
