import { Router } from 'express';

import authRoutes from './auth';
import orderRoutes from './order';
import ordersRoutes from './orders';
import employeeRoutes from './employee';
import employeesRoutes from './employees';

export const getRoutes = (router: Router) => {
  authRoutes(router);
  orderRoutes(router);
  ordersRoutes(router);
  employeeRoutes(router);
  employeesRoutes(router);

  return router;
};
