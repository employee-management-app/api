import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

// eslint-disable-next-line unicorn/prefer-export-from
export { mongoose };
export { User } from './user';
export { Order } from './order';
