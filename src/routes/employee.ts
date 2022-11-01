import { Router } from 'express';

import { getEmployeeOrders, getEmployeeSlots } from '../controllers/employee';
import { verifyToken } from '../middlewares/verifyToken';

export default (router: Router) => {
  router.get('/employee/:id/orders', [verifyToken], getEmployeeOrders);
  router.get('/employee/:id/slots', [verifyToken], getEmployeeSlots);
};
