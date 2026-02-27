import { v2 as cloudinary } from 'cloudinary';
import { Request, Response } from 'express';
import { merge } from 'lodash';

import { Order } from '../models';

const getOrder = (req: Request, res: Response) => {
  Order.findById(req.params.id).populate('assignedEmployee').exec((error, order) => {
    if (error) {
      return res.status(500).send(error);
    }

    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }

    res.send(order);
  });
};

const createOrder = async (req: Request, res: Response) => {
  const { companyId, user } = res.locals;
  const order = new Order({ ...req.body, companyId, createdBy: user._id });

  order.save((error, order) => {
    if (error) {
      return res.status(500).send(error);
    }

    order.populate('assignedEmployee', () => {
      res.send(order);
    });
  });
};

const updateOrder = (req: Request, res: Response) => {
  Order.findById(req.params.id).exec(async (error, order) => {
    if (error) {
      return res.status(500).send(error);
    }

    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }

    if (order.status !== 'completed' && req.body.status === 'completed') {
      order.completedDate = new Date();
    }

    merge(order, req.body);

    order.save((error, order) => {
      if (error) {
        return res.status(400).send(error);
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
      return res.status(500).send(error);
    }

    res.send({ message: 'The order was successfully deleted!' });
  });
};

const uploadFile = (req: Request, res: Response) => {
  Order.findById(req.params.id).exec(async (error, order) => {
    if (error) {
      return res.status(500).send(error);
    }

    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }

    const file = req.body;

    order.files.push(file);
    order.save((error) => {
      if (error) {
        return res.status(500).send(error);
      }

      res.send(file);
    });
  });
};

const removeFile = (req: Request, res: Response) => {
  Order.findById(req.params.id).exec(async (error, order) => {
    if (error) {
      return res.status(500).send(error);
    }

    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }

    cloudinary.uploader.destroy(req.params.fileId, {}, (error) => {
      if (error) {
        return res.status(500).send(error);
      }

      order.files = order.files.filter((file) => file.id !== req.params.fileId);

      order.save((error) => {
        if (error) {
          return res.status(500).send(error);
        }

        res.send({ message: 'File was removed.' });
      });
    });
  });
};

export {
  createOrder,
  deleteOrder,
  getOrder,
  removeFile,
  updateOrder,
  uploadFile,
};
