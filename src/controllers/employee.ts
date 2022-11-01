import { endOfDay, startOfDay } from 'date-fns';
import { Request, Response } from 'express';

import { stringToDate } from '../helpers/stringToDate';
import { Order } from '../models';

export const getEmployeeOrders = (req: Request, res: Response) => {
  const sortBy = (req.query.sortBy ?? 'creationDate') as string;
  const orderBy = req.query.orderBy === 'asc' ? 1 : -1;

  const startDate = (req.query.startDate ?? '') as string;
  const status = (req.query.status ?? '') as string;

  const dateStart = stringToDate(req.query.dateStart as string | undefined) || '';
  const dateEnd = stringToDate(req.query.dateEnd as string | undefined) || '';

  const query = {
    assignedEmployee: req.params.id,
    ...(startDate === 'true' && { startDate: { $ne: null } }),
    ...(startDate === 'false' && { startDate: null }),
    ...(status ? { status } : { status: { $ne: 'completed' } }),
    ...(dateStart && {
      startDate: {
        $gte: startOfDay(dateStart),
        $lt: endOfDay(dateEnd || dateStart),
      },
    }),
  };

  const sorting = {
    [sortBy]: orderBy,
    ...(sortBy !== 'creationDate' && { creationDate: -1 }),
  } as Record<string, 1 | -1>;

  Order.find(query).sort(sorting).populate('assignedEmployee').exec((error, orders) => {
    if (error) {
      return res.status(500).send(error);
    }

    res.send(orders);
  });
};

export const getEmployeeSlots = (req: Request, res: Response) => {
  const query = {
    assignedEmployee: req.params.id,
    ...(req.query.startDate && {
      startDate: {
        $gte: startOfDay(new Date(req.query.startDate as string)),
        $lte: endOfDay(new Date((req.query.endDate || req.query.startDate) as string)),
      },
    }),
  };

  Order.find(query).exec((error, orders) => {
    if (error) {
      return res.status(500).send(error);
    }

    res.send(orders.map(({ _id, startDate, endDate, address, priority }) => ({
      _id,
      startDate,
      endDate,
      address,
      priority,
    })));
  });
};
