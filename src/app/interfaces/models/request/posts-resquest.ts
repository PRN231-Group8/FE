export interface PostsRequest {
  content?: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
  removeAllComments?: boolean;
  commentsToRemove?: string[];
  removeAllPhotos?: boolean;
  photosToRemove?: string[];
}
