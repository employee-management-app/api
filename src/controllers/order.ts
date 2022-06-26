import mongoose from 'mongoose';
import { merge } from 'lodash';
import { Request, Response } from 'express';

import { Order } from '../models';
import { IOrder } from '../models/order';
import { getCoordinatesFromAddress } from '../helpers/getCoordinatesFromAddress';
import { getIsAddressChanged } from '../helpers/getIsAddressChanged';

const normalizeOrder = (order: IOrder): IOrder => {
  const { assignedEmployee } = order;

  const isAssignedEmployeeValid = mongoose.Types.ObjectId.isValid(assignedEmployee ?? '');

  return {
    ...order,
    assignedEmployee: isAssignedEmployeeValid ? (assignedEmployee || null) : null,
    status: order.status 
      ? order.status
      : (order.completionDate && isAssignedEmployeeValid) ? 'inProgress' : 'inbox',
  };
};

const createOrder = async (req: Request, res: Response) => {
  const order = new Order(normalizeOrder(req.body));

  try {
    const address = await getCoordinatesFromAddress(order.address);
    merge(order, { address });
  } catch (err) {
    return res.status(400).send({ message: err });
  }

  order.save((err, order) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    order.populate('assignedEmployee', () => {
      res.send(order);
    });
  });
};

const updateOrder = (req: Request, res: Response) => {
  Order.findById(req.params.id).exec(async (err, order) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }

    const isAddressChanged = getIsAddressChanged(order.address, req.body.address);

    merge(order, normalizeOrder({ 
      assignedEmployee: order.assignedEmployee,
      completionDate: order.completionDate,
      ...req.body, 
    }));

    if (isAddressChanged) {
      try {
        const address = await getCoordinatesFromAddress(order.address);
        merge(order, { address });
      } catch (err) {
        return res.status(400).send({ message: err });
      }
    }

    order.save((err, order) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      order.populate('assignedEmployee', () => {
        res.send(order);
      });
    });
  });
};

// TODO: do not delete the order, but change the status to 'deleted' and respect it in getters
const deleteOrder = (req: Request, res: Response) => {
  Order.findByIdAndDelete(req.params.id).exec((err) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    res.send({ message: 'The order was successfully deleted!' });
  });
};

export {
  createOrder,
  updateOrder,
  deleteOrder,
};
