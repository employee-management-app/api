import mongoose from 'mongoose';

import { File } from './file.d.ts';

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

export interface Order {
  _id: string;
  creationDate: Date;
  createdBy: mongoose.Types.ObjectId | null;
  type: string;
  stage: string;
  address: Address;
  email: string;
  name: string;
  surname: string;
  phone: string;
  message: string;
  employeeMessage: string;
  employeeNotes: string;
  managerMessage: string;
  priority: 0 | 1 | 2 | 3;
  status: 'inbox' | 'inProgress' | 'completed' | 'cancelled' | 'deleted';
  startDate: Date | null;
  completedDate: Date | null;
  endDate: Date | null;
  assignedEmployee: mongoose.Types.ObjectId | null;
  files: File[];
  companyId: mongoose.Types.ObjectId;
}
