import mongoose from 'mongoose';
import { merge } from 'lodash';
import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { unlink } from 'node:fs/promises';

import { Order } from '../models';
import { Order as IOrder } from '../types/order';
import { getCoordinatesFromAddress } from '../helpers/getCoordinatesFromAddress';
import { getIsAddressChanged } from '../helpers/getIsAddressChanged';

const normalizeOrder = (order: IOrder): IOrder => {
  const { assignedEmployee, status, startDate } = order;

  const isAssignedEmployeeValid = mongoose.Types.ObjectId.isValid(assignedEmployee ?? '');

  return {
    ...order,
    assignedEmployee: isAssignedEmployeeValid ? (assignedEmployee || null) : null,
    status: status || ((startDate && isAssignedEmployeeValid) ? 'inProgress' : 'inbox')
  };
};

const getOrder = (req: Request, res: Response) => {
  Order.findById(req.params.id).populate('assignedEmployee').exec((error, order) => {
    if (error) {
      return res.status(500).send({ message: error });
    }

    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }

    res.send(order);
  });
};

const createOrder = async (req: Request, res: Response) => {
  const order = new Order(normalizeOrder(req.body));

  try {
    const address = await getCoordinatesFromAddress(order.address);
    merge(order, { address });
  } catch (error) {
    return res.status(400).send({ message: error });
  }

  order.save((error, order) => {
    if (error) {
      return res.status(500).send({ message: error });
    }

    order.populate('assignedEmployee', () => {
      res.send(order);
    });
  });
};

const updateOrder = (req: Request, res: Response) => {
  Order.findById(req.params.id).exec(async (error, order) => {
    if (error) {
      return res.status(500).send({ message: error });
    }

    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }

    const isAddressChanged = getIsAddressChanged(order.address, req.body.address);

    merge(order, normalizeOrder({ 
      assignedEmployee: order.assignedEmployee,
      startDate: order.startDate,
      endDate: order.endDate,
      ...req.body, 
    }));

    if (isAddressChanged) {
      try {
        const address = await getCoordinatesFromAddress(order.address);
        merge(order, { address });
      } catch (error) {
        return res.status(400).send({ message: error });
      }
    }

    order.save((error, order) => {
      if (error) {
        return res.status(500).send({ message: error });
      }

      order.populate('assignedEmployee', () => {
        res.send(order);
      });
    });
  });
};

// TODO: do not delete the order, but change the status to 'deleted' and respect it in getters
const deleteOrder = (req: Request, res: Response) => {
  Order.findByIdAndDelete(req.params.id).exec((error) => {
    if (error) {
      return res.status(500).send({ message: error });
    }

    res.send({ message: 'The order was successfully deleted!' });
  });
};

const uploadFile = (req: Request, res: Response) => {
  Order.findById(req.params.id).exec(async (error, order) => {
    if (error) {
      return res.status(500).send({ message: error });
    }

    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }

    const path = req.file?.path;

    if (!path) {
      return res.status(400).send({ message: 'File was not provided!' });
    }

    cloudinary.uploader.upload(path, { use_filename: true })
      .then((data) => {
        const file = {
          id: data.public_id,
          format: data.format,
          width: data.width,
          height: data.height,
          url: data.secure_url,
          creationDate: data.created_at as unknown as Date,
        };

        order.files.push(file);

        order.save((error) => {
          if (error) {
            return res.status(500).send({ message: error });
          }
    
          res.send(file);
        });
      })
      .catch((error) => {
        res.status(500).send(error);
      })
      .finally(() => {
        unlink(path);
      });
  });
};

const removeFile = (req: Request, res: Response) => {
  Order.findById(req.params.id).exec(async (error, order) => {
    if (error) {
      return res.status(500).send({ message: error });
    }

    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }

    cloudinary.uploader.destroy(req.params.fileId, {}, (error) => {
      if (error) {
        return res.status(500).send({ message: error });
      }

      order.files = order.files.filter((file) => file.id !== req.params.fileId);

      order.save((error) => {
        if (error) {
          return res.status(500).send({ message: error });
        }
  
        res.send({ message: 'File was removed.' });
      });
    });
  });
};

export {
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  uploadFile,
  removeFile,
};
