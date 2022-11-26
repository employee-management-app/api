import mongoose from 'mongoose';

interface Address {
  fullAddress: string;
  city: string;
  code: string;
  street: string;
  house: string;
  flat?: string;
  lat: number;
  lng: number;
}

interface File {
  id: string;
  format: string;
  width: number;
  height: number;
  url: string;
  creationDate: Date;
}

export interface Order {
  _id: string;
  creationDate: Date;
  type: string;
  stage: string;
  address: Address;
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
  files: File[];
}
