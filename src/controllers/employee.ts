import { Request, Response } from 'express';

import { Order } from '../models';
import { stringToDate } from '../helpers/stringToDate';

const DAY = 60 * 60 * 24 * 1000;

const getEmployeeOrders = (req: Request, res: Response) => {
  const sortBy = (req.query.sortBy ?? 'creationDate') as string;
  const orderBy = req.query.orderBy === 'asc' ? 1 : -1;

  const startDate = (req.query.startDate ?? '') as string;
  const status = (req.query.status ?? '') as string;

  const dateStart = stringToDate(req.query.dateStart as string | undefined) || '';
  const dateEnd = stringToDate(req.query.dateEnd as string | undefined) || '';

  const filter = {
    assignedEmployee: req.params.id,
    ...(startDate === 'true' && { startDate: { $ne: null } }),
    ...(startDate === 'false' && { startDate: null }),
    ...(status ? { status } : { status: { $ne: 'completed' } }),
    ...(dateStart && {
      startDate: {
        $gte: dateStart,
        $lt: new Date((dateEnd || dateStart).getTime() + DAY),
      },
    }),
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
