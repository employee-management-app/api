import { endOfDay, startOfDay } from 'date-fns';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { stringToDate } from '../helpers/stringToDate';
import { Order } from '../models';

const DAY = 60 * 60 * 24 * 1000;

export const getOrders = (req: Request, res: Response) => {
  const sortBy = (req.query.sortBy ?? 'creationDate') as string;
  const orderBy = req.query.orderBy === 'asc' ? 1 : -1;

  const assignedEmployee = (req.query.assignedEmployee ?? '') as string;
  const startDate = (req.query.startDate ?? '') as string;
  const status = (req.query.status ?? '') as string;

  const dateStart = stringToDate(req.query.dateStart as string | undefined) || '';
  const dateEnd = stringToDate(req.query.dateEnd as string | undefined) || '';

  const filter = {
    ...(assignedEmployee === 'true' && { assignedEmployee: { $ne: null } }),
    ...(assignedEmployee === 'false' && { assignedEmployee: null }),
    ...(mongoose.Types.ObjectId.isValid(assignedEmployee) && { assignedEmployee }),
    ...(startDate === 'true' && !dateStart && { startDate: { $ne: null } }),
    ...(startDate === 'false' && !dateStart && { startDate: null }),
    ...(dateStart && {
      startDate: {
        $gte: dateStart,
        $lt: new Date((dateEnd || dateStart).getTime() + DAY),
      },
    }),
    ...(status ? { status } : { status: { $ne: 'completed' } })
  };

  Order.find(filter).sort({ [sortBy]: orderBy }).populate('assignedEmployee').exec((error, orders) => {
    if (error) {
      return res.status(500).send(error);
    }

    res.send(orders);
  });
};

export const getSlots = (req: Request, res: Response) => {
  const startDate = stringToDate(req.query.startDate as string | undefined) || new Date();
  const endDate = stringToDate(req.query.endDate as string | undefined) || '';

  const query = {
    ...(req.query.startDate && {
      startDate: {
        $gte: startOfDay(startDate),
        $lte: endOfDay(endDate || startDate),
      },
    }),
  };

  Order.find(query).populate('assignedEmployee').exec((error, orders) => {
    if (error) {
      return res.status(500).send(error);
    }

    res.send(orders.map(({ _id, startDate, endDate, address, priority, assignedEmployee }) => ({
      _id,
      assignedEmployee,
      startDate,
      endDate,
      address,
      priority,
    })));
  });
};
