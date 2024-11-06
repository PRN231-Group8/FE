import { Comments } from './comment';
import { Photos } from './photo';
import { User } from './user';

export interface Post {
  showComments: boolean;
  displayGallery: boolean;
  postsId: string;
  content: string;
  rating: number;
  status: 'Approved' | 'Pending' | 'Rejected' | undefined;
  createDate: string;
  user: User;
  comments: Comments[];
  photos: Photos[];
}
