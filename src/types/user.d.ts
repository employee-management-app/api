import mongoose from 'mongoose';

export interface User {
  name: string;
  surname: string;
  phone: string;
  email: string;
  password: string;
  role: 'employee' | 'manager' | 'owner' | 'admin';
  registrationDate: Date;
  isVerified: boolean;
  isActive: boolean;
  color: string;
  companyId: mongoose.Types.ObjectId;
}
