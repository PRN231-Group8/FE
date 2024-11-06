import { User } from './user';

export interface Comments {
  createDate: string | number | Date;
  id: string;
  content: string;
  user?: User;
}
