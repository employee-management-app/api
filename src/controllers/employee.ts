import { Request, Response } from 'express';

import { Order } from '../models';

const getEmployeeOrders = (req: Request, res: Response) => {
  const sortBy = (req.query.sortBy ?? 'creationDate') as string;
  const orderBy = req.query.orderBy === 'asc' ? 1 : -1;

  const completionDate = (req.query.completionDate ?? '') as string;

  const filter = {
    assignedEmployee: req.params.id,
    ...(completionDate === 'true' && { completionDate: { $ne: null } }),
    ...(completionDate === 'false' && { completionDate: null }),
  };

  Order.find(filter).sort({ [sortBy]: orderBy }).populate('assignedEmployee').exec((err, orders) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    res.send(orders);
  });
};

export {
  getEmployeeOrders,
};
