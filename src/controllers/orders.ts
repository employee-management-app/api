import mongoose from 'mongoose';
import { Request, Response } from 'express';

import { Order } from '../models';

const getOrders = (req: Request, res: Response) => {
  const sortBy = (req.query.sortBy ?? 'creationDate') as string;
  const orderBy = req.query.orderBy === 'asc' ? 1 : -1;

  const assignedEmployee = (req.query.assignedEmployee ?? '') as string;
  const startDate = (req.query.startDate ?? '') as string;
  const status = (req.query.status ?? '') as string;

  const filter = {
    ...(assignedEmployee === 'true' && { assignedEmployee: { $ne: null } }),
    ...(assignedEmployee === 'false' && { assignedEmployee: null }),
    ...(mongoose.Types.ObjectId.isValid(assignedEmployee) && { assignedEmployee }),
    ...(startDate === 'true' && { startDate: { $ne: null } }),
    ...(startDate === 'false' && { startDate: null }),
    ...(status ? { status } : { status: { $ne: 'completed' } })
  };

  Order.find(filter).sort({ [sortBy]: orderBy }).populate('assignedEmployee').exec((error, orders) => {
    if (error) {
      return res.status(500).send({ message: error });
    }

    res.send(orders);
  });
};

export {
  getOrders,
};
