import { areIntervalsOverlapping, endOfDay, startOfDay } from 'date-fns';
import mongoose from 'mongoose';

import type { Order as IOrder } from '../types/order';

const OrderSchema = new mongoose.Schema<IOrder>({
  creationDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  type: {
    type: String,
    maxLength: 125,
    required: true,
  },
  stage: {
    type: String,
    maxLength: 125,
    required: true,
  },
  address: {
    type: {
      fullAddress: {
        type: String,
        maxLength: 300,
        required: true,
      },
      city: {
        type: String,
        maxLength: 125,
        required: true,
      },
      code: {
        type: String,
        maxLength: 10,
        required: true,
      },
      street: {
        type: String,
        maxLength: 125,
      },
      house: {
        type: String,
        maxLength: 10,
        required: true,
      },
      flat: {
        type: String,
        default: '',
        maxLength: 10,
      },
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    required: true,
  },
  email: {
    type: String,
    maxLength: 125,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
  },
  name: {
    type: String,
    maxLength: 75,
  },
  surname: {
    type: String,
    maxLength: 75,
  },
  phone: {
    type: String,
    maxLength: 20,
    required: true,
  },
  message: {
    type: String,
    default: '',
    maxLength: 1000,
  },
  employeeMessage: {
    type: String,
    default: '',
    maxLength: 1000,
  },
  managerMessage: {
    type: String,
    default: '',
    maxLength: 1000,
  },
  priority: {
    type: Number,
    min: 0,
    max: 3,
    default: 1,
    required: true,
  },
  status: {
    type: String,
    enum: ['inbox', 'inProgress', 'completed', 'cancelled', 'deleted'],
    default: 'inbox',
    required: true,
  },
  startDate: {
    type: Date,
    default: null,
  },
  endDate: {
    type: Date,
    default: null,
  },
  completedDate: {
    type: Date,
    default: null,
  },
  assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'User',
  },
  files: {
    type: [{
      id: {
        type: String,
        required: true,
      },
      format: {
        type: String,
        required: true,
      },
      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      creationDate: {
        type: Date,
      },
    }],
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'Company',
  },
});

OrderSchema.index({
  type: 'text',
  stage: 'text',
  name: 'text',
  email: 'text',
  surname: 'text',
  phone: 'text',
  employeeMessage: 'text',
  managerMessage: 'text',
  status: 'text',
  message: 'text',
  'address.city': 'text',
  'address.street': 'text',
  'address.fullAddress': 'text',
  'address.code': 'text',
});

OrderSchema.post('validate', async (order, next) => {
  if (!order.assignedEmployee || !order.startDate) {
    return next();
  }

  const query = {
    _id: { $ne: order._id },
    assignedEmployee: order.assignedEmployee,
    startDate: {
      $gte: startOfDay(order.startDate),
      $lte: endOfDay(order.startDate),
    },
  };

  const orders = await Order.find(query).populate('assignedEmployee');

  const overlappedOrder = orders.find(({ startDate, endDate }) => {
    if (!startDate || !endDate || !order.startDate || !order.endDate) {
      return false;
    }

    return areIntervalsOverlapping(
      { start: startDate, end: endDate, },
      { start: order.startDate, end: order.endDate, },
    );
  });

  if (overlappedOrder) {
    return next(new mongoose.Error.ValidatorError({
      message: 'Order\'s time overlaps with another order',
      value: {
        order,
        orders: orders,
      },
    }));
  }

  next();
});

OrderSchema.post('validate', (order, next) => {
  const canEdit = order.status === 'inbox' || order.status === 'inProgress';

  if (canEdit) {
    order.set('status', (order.startDate && order.assignedEmployee) ? 'inProgress' : 'inbox');
  }

  next();
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
