import mongoose from 'mongoose';

import type { Company as ICompany } from '../types/company';

export const Company = mongoose.model<ICompany>('Company', new mongoose.Schema<ICompany>({
  name: {
    type: String,
    maxLength: 75,
    required: true,
  },
  logo: {
    type: String,
    required: false,
  },
  canAddImages: {
    type: Boolean,
    default: true,
  },
}));
