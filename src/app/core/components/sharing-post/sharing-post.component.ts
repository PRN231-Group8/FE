import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PostService } from '../../../services/post.service';
import { UserService } from '../../../services/user.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Post } from '../../../interfaces/models/post';
import { AuthenticationService } from '../../../services/authentication.service';
import { CommentRequest } from '../../../interfaces/models/request/commentRequest';
import { CommentResponse } from '../../../interfaces/models/response/commentResponse';
import { UserProfileResponse } from '../../../interfaces/models/response/userProfileResponse';
import { FileUpload } from 'primeng/fileupload';
import { User } from '../../../interfaces/models/user';
import { Comments } from '../../../interfaces/models/comment';
import { UpdatePostRequest } from '../../../interfaces/models/request/updatePostRequest';
import { PostsRequest } from '../../../interfaces/models/request/postsResquest';
import { PhotoService } from '../../../services/photo.service';
import { UpdatePhotoRequest } from '../../../interfaces/models/request/photoRequest';
import { Observable } from 'rxjs';

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
  photoDetails: { id: string; url: string }[] = [];
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
          if (
            response.isSucceed &&
            response.result &&
            !Array.isArray(response.result)
          ) {
            const user = response.result as UserProfileResponse;
            this.userName = `${user.firstName} ${user.lastName}`;
            this.userAvatarUrl = user.avatarPath || '';
            this.role = user.role || 'CUSTOMER';
            this.statusFilter =
              this.role === 'MODERATOR' ? 'Pending' : 'Approved';

            // Set the currentUser property with necessary fields
            this.currentUser = {
              userId: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              avatarPath: user.avatarPath || '',
              dob: user.dob || undefined, // Ensure dob aligns with the User model
            };

            this.fetchPosts();
          }
        },
        error: () => {
          this.displayMessage('error', 'Error', 'Failed to load user profile.');
        },
      });
    }
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
            // Initialize displayGallery for each post to control the gallery visibility
            this.posts = response.result.map(post => ({
              ...post,
              displayGallery: false, // default to hidden gallery
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
        if (response.isSucceed && response.result) {
          this.posts.unshift(response.result as Post);
          this.displayMessage(
            'success',
            'Success',
            'Post created successfully.',
          );
          this.resetPostCreation();
        }
        this.isSubmitting = false;
      },
      error: errorResponse => {
        const errorMessage =
          errorResponse.error?.message || 'Failed to create post.';
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

  postComment(postId: string): void {
    if (this.commentContent.trim()) {
      this.isCommentLoading = true; // Start loading indicator
      const commentRequest: CommentRequest = {
        postId,
        content: this.commentContent,
      };

      this.postService.addComment(commentRequest).subscribe({
        next: response => {
          if (response.isSucceed && response.result) {
            const result = response.result as CommentResponse;

            // Add the comment to the post
            const newComment: Comments = {
              createdDate: result.createdDate,
              id: result.id,
              content: result.content,
              user: this.currentUser,
              postId: result.postId,
            };

            const post = this.posts.find(p => p.postsId === postId);
            if (post) {
              post.comments.push(newComment);
            }

            // Clear the comment input field
            this.commentContent = '';
          }
          this.isCommentLoading = false; // Stop loading after success
        },
        error: () => {
          this.displayMessage('error', 'Error', 'Failed to post comment.');
          this.isCommentLoading = false; // Stop loading on error
        },
      });
    }
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
  openPhotoVideoModal(): void {
    this.showCreatePostModal = true;

    setTimeout(() => {
      this.fileUploader.choose();
    }, 0);
  }
  toggleCommentsVisibility(index: number): void {
    this.posts[index].showComments = !this.posts[index].showComments;
  }
  deletePost(postId: string): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(postId).subscribe({
        next: () => {
          this.posts = this.posts.filter(p => p.postsId !== postId);
          this.displayMessage(
            'success',
            'Success',
            'Post deleted successfully.',
          );
        },
        error: err => {
          this.displayMessage(
            'error',
            'Error',
            'Failed to delete post: ' + err.message,
          );
        },
      });
    }
  }

  // Update Post
  updatePost(): void {
    this.isUpdatePostLoading = true; // Start loading
    if (this.updatePostRequest) {
      this.postService
        .updatePost(this.updatePostRequest.postsId!, this.updatePostRequest)
        .subscribe({
          next: response => {
            if (response.isSucceed) {
              this.displayEditModal = false;
              this.isUpdatePostLoading = false; // Stop loading after success

              // Delay the reload to allow the UI to show loading state
              setTimeout(() => {
                window.location.reload();
              }, 500);
            }
          },
          error: () => {
            this.isUpdatePostLoading = false; // Stop loading on error
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
          photo => photo.id !== photoId,
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
    this.postService.getPostById(post.postsId).subscribe({
      next: response => {
        if (response.isSucceed && response.result) {
          const fullPost = response.result as Post;

          this.updatePostRequest = {
            postsId: fullPost.postsId,
            content: fullPost.content,
            status: fullPost.status,
            removeAllComments: false,
            commentsToRemove: [],
            removeAllPhotos: false,
            photosToRemove: [],
          };

          this.comments = fullPost.comments || [];
          this.photoDetails = (fullPost.photos || []).map(photo => ({
            id: photo.id,
            url: photo.url,
          }));

          this.displayEditModal = true;
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.displayMessage('error', 'Error', 'Failed to load post details.');
      },
    });
  }

  // Get Post Menu Items
  getPostMenuItems(post: Post): MenuItem[] {
    // Check if the user is a Customer and if they own the post
    const isCustomer = this.role === 'CUSTOMER';
    const isOwner = this.role === 'MODERATOR';

    // Define the menu items based on the role and ownership
    const menuItems: MenuItem[] = [];

    if (isOwner) {
      // Allow updating if the user is an owner or moderator
      menuItems.push({
        label: 'Update',
        icon: 'pi pi-pencil',
        command: () => this.openUpdateDialog(post),
      });
      menuItems.push({
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deletePost(post.postsId),
      });
    }

    // Allow deleting if the user is the owner (or if the role has additional permissions)
    if (isCustomer) {
      menuItems.push({
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deletePost(post.postsId),
      });
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
        next: response => {
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
}
