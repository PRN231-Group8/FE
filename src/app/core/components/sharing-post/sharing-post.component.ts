import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PostService } from '../../../services/post.service';
import { UserService } from '../../../services/user.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Post } from '../../../interfaces/models/post';
import { AuthenticationService } from '../../../services/authentication.service';
import { CommentResponse } from '../../../interfaces/models/response/comment-response';
import { UserProfileResponse } from '../../../interfaces/models/response/user-profile-response';
import { FileUpload } from 'primeng/fileupload';
import { User } from '../../../interfaces/models/user';
import { UpdatePostRequest } from '../../../interfaces/models/request/update-post-request';
import { PostsRequest } from '../../../interfaces/models/request/posts-resquest';
import { PhotoService } from '../../../services/photo.service';
import { UpdatePhotoRequest } from '../../../interfaces/models/request/photo-request';
import { Guid } from 'guid-typescript';
import { BaseResponse } from '../../../interfaces/models/base-response';
import { CommentRequest } from '../../../interfaces/models/request/commentRequest';

@Component({
  selector: 'app-sharing-post',
  templateUrl: './sharing-post.component.html',
  styleUrls: ['./sharing-post.component.scss'],
})
export class SharingPostComponent implements OnInit {
  defaultAvatarPath: string =
    'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1';

  @ViewChild('fileUploader') fileUploader!: FileUpload;
  commentContent: string = '';
  displayBasic: boolean = false;
  showCreatePostModal: boolean = false;
  activeIndex: number = 0;
  posts: Post[] = [];
  selectedFiles: File[] = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  showComments: boolean = false;
  comments: CommentResponse[] = [];
  role: string = 'CUSTOMER';
  searchTerm: string = '';
  pageNumber: number = 1;
  pageSize: number = 10;
  statusFilter: string = 'Approved';
  userAvatarUrl: string = '';
  userName: string | undefined;
  postContent: string = '';
  statusOptions = [
    { label: 'Approved', value: 'Approved' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Rejected', value: 'Rejected' },
  ];
  isLoading: boolean = false;
  isUpdatePostLoading: boolean = false;
  showImageUploadDialog: boolean = false;
  isSubmitting: boolean = false;
  activeCommentPostId: string | null = null;
  currentUser: User | undefined;
  displayEditModal = false;
  selectedPost: PostsRequest | null = null;
  updatePostRequest: UpdatePostRequest = {
    postsId: '',
    content: '',
    status: 'Pending',
    removeAllComments: false,
    commentsToRemove: [],
    removeAllPhotos: false,
    photosToRemove: [],
  };
  isCommentLoading: boolean = false;
  isPhotoLoading = false;
  isCancelLoading = false;
  displayUpdateImageDialog = false;
  selectedPhotoId: string | null = null;
  selectedFile: File | null = null;
  photoDetails: { id: Guid; url: string }[] = [];
  displayCommentDialog: boolean = false;
  selectedComment: CommentResponse[] = [];
  selectedPostWithComments: Post | null = null;
  isModerator: boolean = false;
  commentDialog: boolean = false;
  private postPage = 1;
  private commentPage = 1;
  responsiveOptions: any[] = [
    {
      breakpoint: '1500px',
      numVisible: 5,
    },
    {
      breakpoint: '1024px',
      numVisible: 3,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];
  constructor(
    private postService: PostService,
    private userService: UserService,
    private photoService: PhotoService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    const email = this.authenticationService.getEmailFromToken();
    if (email) {
      this.userService.getUserByEmail(email).subscribe({
        next: response => {
          if (response.isSucceed && response.result) {
            const user = response.result as UserProfileResponse;
            this.userName = `${user.firstName} ${user.lastName}`;
            this.userAvatarUrl = user.avatarPath || '';
            this.role = user.role || 'CUSTOMER';

            // Set statusFilter based on role
            this.statusFilter =
              this.role === 'MODERATOR' ? 'Pending' : 'Approved';

            // Set currentUser
            this.currentUser = {
              userId: user.userId,
              firstName: user.firstName,
              lastName: user.lastName,
              avatarPath: user.avatarPath || '',
              dob: user.dob || undefined,
            };

            this.isModerator = this.role === 'MODERATOR';

            // Load posts only after setting statusFilter
            this.loadPosts();
          }
        },
        error: () => {
          this.displayMessage('error', 'Error', 'Failed to load user profile.');
        },
      });
    }
  }

  loadPosts(): void {
    this.isLoading = true;
    this.postService
      .getAllPosts(
        this.statusFilter,
        this.searchTerm,
        this.postPage,
        this.pageSize,
      )
      .subscribe({
        next: (response: BaseResponse<Post[]>) => {
          if (response.isSucceed && response.result) {
            this.posts = response.result.map(post => ({
              ...post,
              menuItems: this.generateMenuItems(post),
            }));
            this.postPage++; // Increment page number for pagination
          } else {
            const errorMessage = response.message || 'No posts available.';
            this.displayMessage('info', 'Info', errorMessage);
          }
          this.isLoading = false;
        },
        error: errorResponse => {
          const errorMessage =
            errorResponse?.error?.message || 'Failed to load user profile.';
          this.displayMessage('error', 'Error', errorMessage);
        },
      });
  }

  fetchPosts(): void {
    this.isLoading = true; // Start loading
    this.postService
      .getAllPosts(
        this.statusFilter,
        this.searchTerm,
        this.pageNumber,
        this.pageSize,
      )
      .subscribe({
        next: response => {
          if (response.isSucceed && Array.isArray(response.result)) {
            this.posts = response.result.map(post => ({
              ...post,
              showComments: false, // Initialize with comments hidden
              menuItems: this.generateMenuItems(post),
            })) as Post[];
          } else {
            this.posts = [];
          }
          this.isLoading = false; // Stop loading after success
          this.cdr.detectChanges();
        },
        error: () => {
          this.displayMessage('error', 'Error', 'Failed to fetch posts.');
          this.isLoading = false; // Stop loading after error
        },
      });
  }

  showGalleria(index: number): void {
    this.posts[index].displayGallery = true;
  }
  onFocus(): void {
    this.showCreatePostModal = true;
  }

  createPost(): void {
    this.isSubmitting = true;
    const formData = new FormData();
    formData.append('content', this.postContent);
    this.selectedFiles.forEach(file => formData.append('Photos', file));

    this.postService.createPost(formData).subscribe({
      next: response => {
        if (response.isSucceed) {
          const successMessage = 'Please wait for your post to be approved.';
          this.displayMessage('info', 'Approval Request', successMessage);

          this.resetPostCreation();
        }
        this.isSubmitting = false;
      },
      error: errorResponse => {
        console.error('Full error response:', errorResponse); // Log the entire error response for inspection
        // Adjusted error message extraction
        const errorMessage =
          errorResponse.error?.message ||
          errorResponse.message ||
          'Failed to create post.';
        this.displayMessage('error', 'Error', errorMessage);
        this.isSubmitting = false;
      },
    });
  }

  private resetPostCreation(): void {
    this.showCreatePostModal = false;
    this.postContent = '';
    this.selectedFiles = [];
    this.fileUploader.clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onSelectedFiles(event: { currentFiles: File[] }): void {
    this.selectedFiles = event.currentFiles;
    this.updateFileSize();
  }

  private updateFileSize(): void {
    this.totalSize = this.selectedFiles.reduce(
      (sum, file) => sum + file.size,
      0,
    );
    this.totalSizePercent = (this.totalSize / 1000000) * 100;
  }

  toggleComments(): void {
    this.showComments = !this.showComments;
  }

  // Load a specific post to refresh its comments
  loadSinglePost(postId: string): void {
    this.postService.getPostById(postId).subscribe({
      next: response => {
        if (response.isSucceed && response.result) {
          const updatedPost = response.result as Post;
          const postIndex = this.posts.findIndex(p => p.postsId === postId);
          if (postIndex !== -1) {
            this.posts[postIndex] = updatedPost; // Replace the post with updated data
            this.cdr.detectChanges(); // Trigger change detection
          }
        }
      },
      error: () => {
        this.displayMessage('error', 'Error', 'Failed to reload post.');
      },
    });
  }

  private displayMessage(
    severity: string,
    summary: string,
    detail: string,
  ): void {
    this.messageService.add({ severity, summary, detail });
  }

  choose(event: MouseEvent, chooseCallback: () => void): void {
    event.preventDefault();
    chooseCallback();
  }

  onTemplatedUpload(): void {
    this.displayMessage('success', 'Success', 'Files Uploaded Successfully');
  }
  // openPhotoVideoModal(): void {
  //   this.showCreatePostModal = true;

  //   setTimeout(() => {
  //     this.fileUploader.choose();
  //   }, 0);
  // }
  deletePost(postId: string): void {
    this.confirmationService.confirm({
      header: 'Confirmation',
      message: 'Are you sure you want to delete this post?',
      acceptIcon: 'pi pi-check mr-2',
      rejectIcon: 'pi pi-times mr-2',
      rejectButtonStyleClass: 'p-button-sm',
      acceptButtonStyleClass: 'p-button-outlined p-button-sm',
      accept: () => {
        this.postService.deletePost(postId).subscribe({
          next: response => {
            const successMessage =
              response.message || 'Post deleted successfully.';
            this.posts = this.posts.filter(p => p.postsId !== postId);
            this.displayMessage('success', 'Success', successMessage);
          },
          error: err => {
            const errorMessage = err?.message || 'Failed to delete post.';
            this.displayMessage('error', 'Error', errorMessage);
          },
        });
      }
    });
  }

  updatePost(): void {
    this.isUpdatePostLoading = true; // Start loading

    if (this.updatePostRequest) {
      this.postService
        .updatePost(this.updatePostRequest.postsId!, this.updatePostRequest)
        .subscribe({
          next: response => {
            if (response.isSucceed) {
              const successMessage =
                response.message || 'Post updated successfully.';

              // Update the specific post in the posts list without reloading
              const updatedPostIndex = this.posts.findIndex(
                post => post.postsId === this.updatePostRequest.postsId,
              );
              if (updatedPostIndex !== -1) {
                // Update the post's content and status in the current list
                this.posts[updatedPostIndex].content =
                  this.updatePostRequest.content ?? '';
                this.posts[updatedPostIndex].status =
                  this.updatePostRequest.status;
              }

              // Show the success message
              this.displayMessage('success', 'Success', successMessage);
              this.displayEditModal = false;
            } else {
              this.displayMessage(
                'error',
                'Error',
                response.message || 'Failed to update post.',
              );
            }
            this.isUpdatePostLoading = false;
          },
          error: errorResponse => {
            const errorMessage =
              errorResponse?.response?.message || 'Failed to update post.';
            this.displayMessage('error', 'Error', errorMessage);
            this.isUpdatePostLoading = false;
          },
        });
    }
  }

  // Optional: Cancel update function with loading state
  cancelUpdate(): void {
    this.isCancelLoading = true;
    setTimeout(() => {
      this.displayEditModal = false;
      this.isCancelLoading = false;
    }, 500); // Simulate delay for cancel
  }

  confirmRemoveComment(commentId: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this comment?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Temporarily remove the comment from the UI
        this.comments = this.comments.filter(
          comment => comment.id !== commentId,
        );

        // Add the comment ID to commentsToRemove for tracking
        if (!this.updatePostRequest.commentsToRemove) {
          this.updatePostRequest.commentsToRemove = [];
        }
        this.updatePostRequest.commentsToRemove.push(commentId);

        // Optionally show a success message
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmed',
          detail: 'Comment removed successfully',
        });
      },
      reject: () => {
        // Optionally show a cancellation message
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Comment removal cancelled',
        });
      },
    });
  }

  confirmRemovePhoto(photoId: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this photo?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Temporarily remove the photo from the UI
        this.photoDetails = this.photoDetails.filter(
          photo => photo.id.toString() !== photoId,
        );

        // Add the photo ID to photosToRemove for tracking
        if (!this.updatePostRequest.photosToRemove) {
          this.updatePostRequest.photosToRemove = [];
        }
        this.updatePostRequest.photosToRemove.push(photoId);

        // Optionally show a success message
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmed',
          detail: 'Photo removed successfully',
        });
      },
      reject: () => {
        // Optionally show a cancellation message
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Photo removal cancelled',
        });
      },
    });
  }

  // Remove a specific comment
  removeComment(commentId: string): void {
    if (this.updatePostRequest) {
      this.updatePostRequest.commentsToRemove =
        this.updatePostRequest.commentsToRemove?.filter(id => id !== commentId);
    }
  }
  // Remove a specific photo
  removePhoto(photoId: string): void {
    if (this.updatePostRequest) {
      this.updatePostRequest.photosToRemove =
        this.updatePostRequest.photosToRemove?.filter(id => id !== photoId);
    }
  }

  // Open the Update Dialog
  openUpdateDialog(post: Post): void {
    console.log(post);
    this.updatePostRequest = {
      postsId: post.postsId,
      content: post.content,
      status: post.status,
      removeAllComments: false,
      commentsToRemove: [],
      removeAllPhotos: false,
      photosToRemove: [],
    };

    this.comments = post.comments || [];
    this.photoDetails = (post.photos || []).map(photo => ({
      id: photo.id as Guid,
      url: photo.url as string,
    }));

    this.displayEditModal = true;
    this.cdr.detectChanges();
  }

  private generateMenuItems(post: Post): MenuItem[] {
    console.log(post);
    const isOwner = this.currentUser?.userId === post.user.userId;
    const menuItems: MenuItem[] = [];
    if (isOwner || this.isModerator) {
      menuItems.push(
        {
          label: 'Update',
          icon: 'pi pi-pencil',
          command: () => this.openUpdateDialog(post),
        },
        {
          label: 'Delete',
          icon: 'pi pi-trash',
          command: () => this.deletePost(post.postsId),
        },
      );
    }
    return menuItems;
  }

  // Close the Edit Dialog
  closeEditDialog(): void {
    this.displayEditModal = false;
  }

  openUpdateImageDialog(photoId: string): void {
    this.selectedPhotoId = photoId; // Set the selected photo ID
    this.displayUpdateImageDialog = true; // Open the update dialog
  }

  // Handles file selection
  onFileSelect(event: any): void {
    this.selectedFile = event.files[0]; // Store the selected file
  }

  // Calls the API to update the image
  updateImage(): void {
    if (this.selectedPhotoId && this.selectedFile) {
      const updateRequest: UpdatePhotoRequest = {
        photoId: this.selectedPhotoId,
        postId: this.updatePostRequest.postsId ?? '',
        file: this.selectedFile,
      };

      this.photoService.updatePhoto(updateRequest).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Photo updated successfully',
          });
          this.displayUpdateImageDialog = false;
          this.selectedFile = null; // Clear selected file after update
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update photo',
          });
        },
      });
    }
  }

  // Optional: Clear the file input and selected photo ID on close
  onDialogClose(): void {
    this.selectedFile = null;
    this.selectedPhotoId = null;
  }

  // Update this method to watch for changes in the checkbox status
  onRemoveAllPhotosChange(): void {
    if (this.updatePostRequest.removeAllPhotos) {
      this.updatePostRequest.photosToRemove = [];
    }
  }

  onRemoveAllCommentsChange(): void {
    if (this.updatePostRequest.removeAllComments) {
      this.updatePostRequest.commentsToRemove = [];
    }
  }

  // Trigger loadPosts when the user scrolls to the bottom
  onScrollPosts(): void {
    this.loadPosts();
  }

  toggleCommentsVisibility(post: Post): void {
    this.commentDialog = false;
    if (this.selectedPostWithComments === post) {
      // Clear the selection to close the comment section
      this.selectedPostWithComments = null;
    } else {
      // Set the selected post and reset comments
      this.selectedPostWithComments = post;
      this.commentPage = 1; // Reset pagination
      post.comments = []; // Clear existing comments to avoid duplication
      this.commentDialog = true;
      this.loadComments(post);
    }
  }

  loadComments(post: Post): void {
    this.postService.getCommentsByPostId(post.postsId).subscribe({
      next: response => {
        if (response.isSucceed && response.result) {
          post.comments = [...post.comments, ...response.result];
          this.commentPage++;
        }
      },
      error: () => {
        this.displayMessage('error', 'Error', 'Failed to load comments.');
      },
    });
  }

  onScrollComments(): void {
    if (this.selectedPostWithComments && !this.isCommentLoading) {
      this.isCommentLoading = true; // Prevent duplicate loads
      this.postService
        .getCommentsByPostId(this.selectedPostWithComments.postsId)
        .subscribe({
          next: (response: BaseResponse<CommentResponse[]>) => {
            if (
              response.isSucceed &&
              response.result &&
              response.result.length > 0
            ) {
              const newComments = response.result.filter(
                newComment =>
                  !this.selectedPostWithComments!.comments.some(
                    existingComment => existingComment.id === newComment.id,
                  ),
              );
              this.selectedPostWithComments!.comments = [
                ...(this.selectedPostWithComments?.comments || []),
                ...newComments,
              ];
              this.commentPage++; // Move to the next page for the next load
            } else {
              // No more comments to load
              this.isCommentLoading = false;
            }
          },
          error: () => {
            this.displayMessage('error', 'Error', 'Failed to load comments.');
            this.isCommentLoading = false;
          },
          complete: () => {
            this.isCommentLoading = false; // Reset loading status after completion
          },
        });
    }
  }

  postComment(post: Post): void {
    if (this.commentContent.trim()) {
      this.isCommentLoading = true;
      const commentRequest: CommentRequest = {
        postId: post.postsId, // Map 'postsId' to 'postId'
        content: this.commentContent,
      };

      this.postService.addComment(commentRequest).subscribe({
        next: response => {
          if (response.isSucceed) {
            this.loadComments(post);
            this.commentContent = ''; // Clear input
            const successMessage = response.message || 'Comment successfully.';
            this.displayMessage('success', 'Success', successMessage);
          }
          this.isCommentLoading = false;
        },
      });
    }
  }

  closeCommentSection(): void {
    this.selectedPostWithComments = null;
    this.commentContent = '';
    this.commentDialog = false;
  }

  showCommentDialog(): void {
    this.commentDialog = true;
  }

  getNumberCommentsOfPost(post: Post): string {
    return post.comments.length.toString();
  }
}
