export interface User {
  isSucceed?: boolean;
  userId?: string;
  firstName?: string;
  lastName?: string;
  dob?: Date;
  gender?: string;
  address?: string;
  createdDate?: Date;
  createdBy?: string;
  lastUpdatedBy?: string;
  lastUpdatedDate?: Date;
  avatarPath?: string;
  verifyToken?: string;
  verifyTokenExpires?: Date;
  isActived?: boolean;
  phoneNumber?: string;
  email?: string;
  token?: string;
  role?: string;
}
