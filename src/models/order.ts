import mongoose from 'mongoose';

import { Order as IOrder } from '../types/order';

export const Order = mongoose.model<IOrder>('Order', new mongoose.Schema<IOrder>({
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
  address: {
    type: {
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
        required: true,
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
    required: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
  },
  name: {
    type: String,
    maxLength: 75,
    required: true,
  },
  surname: {
    type: String,
    maxLength: 75,
    required: true,
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
  completionDate: {
    type: Date,
    default: null,
  },
 assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'User',
  },
}));
