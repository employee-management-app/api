import mongoose from 'mongoose';

import { User as IUser } from '../types/user';

export const User = mongoose.model<IUser>('User', new mongoose.Schema<IUser>({
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
  email: {
    type: String,
    maxLength: 125,
    required: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['employee', 'manager', 'admin'],
    required: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: true,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true,
  },
}));
