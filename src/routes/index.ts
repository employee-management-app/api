import { Router } from 'express';

import authRoutes from './auth';
import companiesRoutes from './companies';
import companyRoutes from './company';
import employeeRoutes from './employee';
import employeesRoutes from './employees';
import managerRoutes from './manager';
import managersRoutes from './managers';
import orderRoutes from './order';
import ordersRoutes from './orders';

export const getRoutes = (router: Router) => {
  authRoutes(router);
  companiesRoutes(router);
  companyRoutes(router);
  employeeRoutes(router);
  employeesRoutes(router);
  managerRoutes(router);
  managersRoutes(router);
  orderRoutes(router);
  ordersRoutes(router);

  return router;
};
