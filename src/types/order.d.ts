import mongoose from 'mongoose';

export interface Order {
  _id: string;
  creationDate: Date;
  type: string;
  address: {
    city: string;
    code: string;
    street: string;
    house: string;
    flat: string;
    lat: number;
    lng: number;
  };
  email: string;
  name: string;
  surname: string;
  phone: string;
  message: string;
  employeeMessage: string;
  managerMessage: string;
  priority: 0 | 1 | 2 | 3;
  status: 'inbox' | 'inProgress' | 'completed' | 'cancelled' | 'deleted';
  startDate: Date | null;
  endDate: Date | null;
  assignedEmployee: mongoose.Types.ObjectId | null;
  files: {
    id: string,
    format: string,
    width: number,
    height: number,
    url: string,
    creationDate: Date,
  }[];
}
