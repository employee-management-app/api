import { endOfDay, startOfDay } from 'date-fns';
import { Request, Response } from 'express';

import { sortNotCompletedOrders } from '../helpers/sortNotCompletedOrders';
import { stringToDate } from '../helpers/stringToDate';
import { Order } from '../models';
import type { Order as OrderType } from '../types/order';

const DAY = 60 * 60 * 24 * 1000;

interface Query {
  status?: OrderType['status'];
  startDate?: string;
  endDate?: string;
  employee?: OrderType['_id'] | OrderType['_id'][];
  stage?: OrderType['stage'] | OrderType['stage'][];
  priority?: OrderType['priority'] | OrderType['priority'][];
  type?: OrderType['type'] | OrderType['type'][];
  unscheduled?: 'true' | 'false';
  unassigned?: 'true' | 'false';
}

export const getOrders = (req: Request<any, any, any, Query>, res: Response) => {
  const { status, unscheduled, unassigned } = req.query;
  const startDate = stringToDate(req.query.startDate);
  const endDate = stringToDate(req.query.endDate);
  const employee = req.query.employee ? [req.query.employee].flat() : null;
  const stage = req.query.stage ? [req.query.stage].flat() : null;
  const priority = req.query.priority ? [req.query.priority].flat() : null;
  const type = req.query.type ? [req.query.type].flat() : null;
  const returnUnscheduled = unscheduled ? unscheduled === 'true' : false;
  const returnUnassigned =  unassigned ? unassigned === 'true' : false;

  const orWrapper = (query: Record<string, object>) => {
    if (returnUnscheduled && returnUnassigned) {
      return { $or: [query, { assignedEmployee: null }, { startDate: null }] };
    }

    if (returnUnscheduled) {
      return { $or: [query, { startDate: null }] };

    }

    if (returnUnassigned) {
      return { $or: [query, { assignedEmployee: null }] };
    }

    return query;
  };

  const filter = {
    ...(status ? { status } : { status: { $ne: 'completed' } }),
    ...orWrapper({
      ...(startDate && {
        startDate: {
          $gte: startDate,
          $lt: new Date((endDate ?? startDate).getTime() + DAY),
        },
      }),
      ...(employee && { assignedEmployee: { $in: employee } }),
      ...(stage && { stage: { $in: stage } }),
      ...(priority && { priority: { $in: priority } }),
      ...(type && { type: { $in: type } }),
    }),
  };

  const sort = status === 'completed'
    ? { completedDate: -1, _id: -1 } as const
    : undefined;

  Order.find(filter).populate('assignedEmployee').sort(sort).exec((error, orders) => {
    if (error) {
      return res.status(500).send(error);
    }

    if (status) {
      return res.send(orders);
    }

    res.send([...orders].sort(sortNotCompletedOrders));
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
