import mongoose from 'mongoose';

import { User } from './user';
import { Order } from './order';

mongoose.Promise = global.Promise;

export {
  mongoose,
  User,
  Order,
};
