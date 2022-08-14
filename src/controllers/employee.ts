import { Request, Response } from 'express';

import { Order } from '../models';

const getEmployeeOrders = (req: Request, res: Response) => {
  const sortBy = (req.query.sortBy ?? 'creationDate') as string;
  const orderBy = req.query.orderBy === 'asc' ? 1 : -1;

  const completionDate = (req.query.completionDate ?? '') as string;
  const status = (req.query.status ?? '') as string;
  
  const filter = {
    assignedEmployee: req.params.id,
    ...(completionDate === 'true' && { completionDate: { $ne: null } }),
    ...(completionDate === 'false' && { completionDate: null }),
    ...(status ? { status } : { status: { $ne: 'completed' } })
  };

  const sorting = { 
    [sortBy]: orderBy, 
    ...(sortBy !== 'creationDate' && { creationDate: -1 }), 
  } as Record<string, 1 | -1>;

  Order.find(filter).sort(sorting).populate('assignedEmployee').exec((error, orders) => {
    if (error) {
      return res.status(500).send({ message: error });
    }

    res.send(orders);
  });
};

export {
  getEmployeeOrders,
};
