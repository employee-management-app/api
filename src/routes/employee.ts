import { Router } from 'express';

import { getEmployeeOrders, getEmployeeSlots, inviteEmployee, updateEmployee } from '../controllers/employee';
import { verifyToken } from '../middlewares/verifyToken';

export default (router: Router) => {
  router.get('/employee/:id/orders', [verifyToken], getEmployeeOrders);
  router.get('/employee/:id/slots', [verifyToken], getEmployeeSlots);
  router.post('/employee', [verifyToken], inviteEmployee);
  router.patch('/employee/:id', [verifyToken], updateEmployee);
};
