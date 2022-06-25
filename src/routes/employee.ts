import { Router } from 'express';

import { getEmployeeOrders } from '../controllers/employee';
import { veryfyToken } from '../middlewares/veryfyToken';

export default (router: Router) => {
  router.get('/employee/:id/orders', [veryfyToken], getEmployeeOrders);
};
