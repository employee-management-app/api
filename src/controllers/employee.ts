import { endOfDay, startOfDay } from 'date-fns';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { sendEmail } from '../helpers/sendEmail';
import { stringToDate } from '../helpers/stringToDate';
import { Order, User } from '../models';

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
