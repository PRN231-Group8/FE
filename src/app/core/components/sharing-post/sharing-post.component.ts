import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../../../services/photo.service';

@Component({
  selector: 'app-sharing-post',
  templateUrl: './sharing-post.component.html',
  styleUrls: ['./sharing-post.component.scss'],
})
export class SharingPostComponent implements OnInit {
  commentContent: any;
  displayBasic: boolean = false;
  showCreatePostModal: boolean = false;
  activeIndex: number = 0;

  images: any[] = [];
  responsiveOptions: any[] = [
    { breakpoint: '1500px', numVisible: 5 },
    { breakpoint: '1024px', numVisible: 3 },
    { breakpoint: '768px', numVisible: 2 },
    { breakpoint: '560px', numVisible: 1 },
  ];

  userAvatarUrl: string =
    'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg';
  userName: string = 'Quốc Sơn';
  time: string = '2 hours ago';
  title: string = 'Son DiOR';
  description: string = 'Son Dep Trai';
  postContent: string = '';
  postTitle: string = '';
  totalSize: number = 0;
  totalSizePercent: number = 0;
  replyContent: any;
  replyToCommentId: number | null = null;
  showComments: boolean = false;
  comments = [
    {
      id: 1,
      userAvatar: 'path_to_avatar1.jpg',
      userName: 'Ngoc That',
      content: 'This is a sample comment',
      time: '2 days ago',
    },
    {
      id: 2,
      userAvatar: 'path_to_avatar2.jpg',
      userName: 'Another User',
      content: 'Another sample comment',
      time: '1 day ago',
    },
  ];
  constructor(private photoService: PhotoService) {}

  ngOnInit() {
    this.photoService.getImages().then((images: any[]) => {
      this.images = images;
    });
  }

  showGalleria(index: number): void {
    this.activeIndex = index;
    this.displayBasic = true;
  }

  commentOnPost(): void {
    console.log('Comment button clicked');
  }

  onFocus(): void {
    this.showCreatePostModal = true;
  }

  createPost(): void {
    if (this.postContent) {
      console.log('Creating post:', this.postContent);
      this.showCreatePostModal = false;
      this.postContent = ''; // Clear input after posting
    }
  }

  openLiveVideoModal(): void {
    console.log('Live video clicked');
  }

  openPhotoVideoModal(): void {
    console.log('Photo/Video clicked');
  }

  openFeelingActivityModal(): void {
    console.log('Feeling/Activity clicked');
  }

  onTemplatedUpload(): void {
    console.log('Files uploaded');
  }

  onSelectedFiles(event: { currentFiles: { size: number }[] }): void {
    this.totalSize = event.currentFiles.reduce(
      (sum, file) => sum + file.size,
      0,
    );
    this.totalSizePercent = (this.totalSize / 1000000) * 100;
  }

  onRemoveTemplatingFile(
    event: any,
    file: any,
    removeFileCallback: Function,
    i: number,
  ): void {
    removeFileCallback(event, i); // Use 'i' as the index argument here
    this.totalSize -= file.size;
    this.totalSizePercent = (this.totalSize / 1000000) * 100;
  }

  removeUploadedFileCallback(j: number): void {
    console.log(`Removing uploaded file at index ${j}`);
    // Add logic here if necessary
  }

  uploadEvent(callback: Function): void {
    callback(); // Trigger the upload event
  }

  choose(event: MouseEvent, callback: Function): void {
    callback(); // Trigger the file chooser
  }
  // Implementation of postComment method
  postComment(): void {
    if (this.commentContent.trim()) {
      console.log('Posting comment:', this.commentContent);
      this.commentContent = ''; // Clear the input after posting
    }
  }

  sendReply(commentId: number): void {
    if (this.replyContent.trim()) {
      console.log(`Replying to comment ${commentId}:`, this.replyContent);
      this.replyContent = ''; // Clear reply input
      this.replyToCommentId = null; // Hide reply input after sending
    }
  }
  toggleComments(): void {
    this.showComments = !this.showComments;
  }

  toggleReply(commentId: number): void {
    this.replyToCommentId =
      this.replyToCommentId === commentId ? null : commentId;
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
