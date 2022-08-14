export interface User {
  name: string;
  surname: string;
  phone: string;
  email: string;
  password: string;
  role: 'employee' | 'manager' | 'admin';
  registrationDate: Date;
  isVerified: boolean;
  isActive: boolean;
}
