import { User } from './user';

export interface Comments {
  id: string;
  content: string;
  createdDate: string;
  user?: User;
  postId: string;
}
