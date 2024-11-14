import { MenuItem } from 'primeng/api/menuitem';
import { Comments } from './comment';
import { Photo } from './photo';
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
  photos: Photo[];
  menuItems?: MenuItem[];
  isRecommended: boolean;
  tourTripId: string;
  title: string;
}
