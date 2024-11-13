import { User } from '../user';

export interface CommentResponse {
  id: string;
  content: string;
  createdDate: string;
  user?: User;
  postId: string;
}
