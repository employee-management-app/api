import { endOfDay, startOfDay } from 'date-fns';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { sendEmail } from '../helpers/sendEmail';
import { stringToDate } from '../helpers/stringToDate';
import { Order, User } from '../models';
import type { Order as OrderType } from '../types/order';

const DAY = 60 * 60 * 24 * 1000;

interface Query {
  status?: OrderType['status'];
  startDate?: string;
  endDate?: string;
  stage?: OrderType['stage'] | OrderType['stage'][];
  priority?: OrderType['priority'] | OrderType['priority'][];
  type?: OrderType['type'] | OrderType['type'][];
  orderBy?: string;
  sortBy?: 'acs' | 'desc';
  scheduledOnly?: 'true';
  limit?: string;
  offset?: string;
}

export const getEmployeeOrders = (req: Request<any, any, any, Query>, res: Response) => {
  const sortBy = (req.query.sortBy ?? 'creationDate') as string;
  const orderBy = req.query.orderBy === 'asc' ? 1 : -1;

  const { status, scheduledOnly } = req.query;
  const startDate = stringToDate(req.query.startDate);
  const endDate = stringToDate(req.query.endDate);
  const stage = req.query.stage ? [req.query.stage].flat() : null;
  const priority = req.query.priority ? [req.query.priority].flat() : null;
  const type = req.query.type ? [req.query.type].flat() : null;
  const returnScheduledOnly = !!scheduledOnly;

  const query = {
    assignedEmployee: req.params.id,
    ...(status ? { status } : { status: { $ne: 'completed' } }),
    ...(returnScheduledOnly && { startDate: { $ne: null } }),
    ...(startDate && {
      startDate: {
        $gte: startDate,
        $lt: new Date((endDate ?? startDate).getTime() + DAY),
      },
    }),
    ...(stage && { stage: { $in: stage } }),
    ...(priority && { priority: { $in: priority } }),
    ...(type && { type: { $in: type } }),
  };

  const sorting = {
    [sortBy]: orderBy,
    ...(sortBy !== 'creationDate' && { creationDate: -1 }),
  } as Record<string, 1 | -1>;

  const limit = Number(req.query.limit ?? Number.POSITIVE_INFINITY);
  const offset = Number(req.query.offset ?? 0);

  Order.find(query).sort(sorting).limit(limit).skip(offset).populate('assignedEmployee').exec((error, orders) => {
    if (error) {
      return res.status(500).send(error);
    }

    Order.count(query, (_, total) => {
      res.send({ orders, total });
    });
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

    res.send(orders.map(({ _id, startDate, endDate, address, priority, status }) => ({
      _id,
      startDate,
      status,
      endDate,
      address,
      priority,
    })));
  });
};

export const inviteEmployee = (req: Request, res: Response) => {
  User.create({ ...req.body, isVerified: false })
    .then((data) => {
      const token = jwt.sign({ id: data._id }, process.env.JWT_SECRET as jwt.Secret, { expiresIn: '24h' });

      sendEmail({
        to: req.body.email,
        subject: 'Perfecta - complete your registration',
        html: `
          <h3>Hey ${req.body.name}, you have been invited to work together in the Perfecta system!</h3>
          <p>Click the button below to complete your registration</p>
          <a href="${process.env.CLIENT_URL}/invitation/${token}" style="display: inline-block; text-decoration: none; background: #1352a1; color: #ffffff; padding: 8px 14px; border-radius: 4px;">Complete registration</a>
        `
      });

      res.send(data);
    })
    .catch((error) => {
      if (error.code === 11000) {
        return res.status(400).send({ message: 'The user already exists' });
      }

      return res.status(500).send(error);
    });
};

export const updateEmployee = (req: Request, res: Response) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec((error, user) => {
    if (error) {
      return res.status(500).send(error);
    }

    res.send(user);
  });
};
