export interface UpdatePostRequest {
  postsId: string | undefined;
  content: string | undefined;
  status: 'Approved' | 'Pending' | 'Rejected' | undefined;
  removeAllComments: boolean;
  commentsToRemove: string[];
  removeAllPhotos: boolean;
  photosToRemove: string[];
}
