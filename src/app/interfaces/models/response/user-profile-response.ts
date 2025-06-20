export interface UserProfileResponse {
  userId: string;
  firstName: string;
  lastName: string;
  dob: Date | null;
  gender: string;
  email: string;
  avatarPath?: string;
  address?: string;
  createdDate: Date;
  lastUpdatedDate?: Date;
  role: string;
}
