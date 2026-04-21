import { Types } from 'mongoose';

/**
 * Represents the shape of a populated DepartmentDocument reference
 * on a UserDocument when Mongoose `.populate('department')` is called.
 */
export interface PopulatedDepartment {
  _id: Types.ObjectId;
  name: string;
  companyId: string;
  employeeIds: string[];
  createdAt: Date;
  updatedAt: Date;
}
