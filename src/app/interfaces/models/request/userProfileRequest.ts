export interface UserProfileRequest {
  firstName: string;
  lastName: string;
  dob: Date;
  gender: string;
  avatarPath?: string;
}
