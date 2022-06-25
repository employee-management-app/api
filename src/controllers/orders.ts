import mongoose from 'mongoose';
import { Request, Response } from 'express';

import { Order } from '../models';

const getOrders = (req: Request, res: Response) => {
  const sortBy = (req.query.sortBy ?? 'creationDate') as string;
  const orderBy = req.query.orderBy === 'asc' ? 1 : -1;

  const assignedEmployee = (req.query.assignedEmployee ?? '') as string;
  const completionDate = (req.query.completionDate ?? '') as string;

  const filter = {
    ...(assignedEmployee === 'true' && { assignedEmployee: { $ne: null } }),
    ...(assignedEmployee === 'false' && { assignedEmployee: null }),
    ...(mongoose.Types.ObjectId.isValid(assignedEmployee) && { assignedEmployee }),
    ...(completionDate === 'true' && { completionDate: { $ne: null } }),
    ...(completionDate === 'false' && { completionDate: null }),
  };

  Order.find(filter).sort({ [sortBy]: orderBy }).exec((err, orders) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    res.send(orders);
  });
};

export {
  getOrders,
};
