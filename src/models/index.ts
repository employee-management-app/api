import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

// eslint-disable-next-line unicorn/prefer-export-from
export { mongoose };
export { Order } from './order';
export { User } from './user';
