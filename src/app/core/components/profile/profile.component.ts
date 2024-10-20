import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [MessageService],
})
export class ProfileComponent implements OnInit {
  private apiUrl = `${environment.BACKEND_API_URL}/api/users`;
  items!: MenuItem[];
  activeItem!: MenuItem;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  email: string | null = null;
  genderOptions: { label: string; value: string }[] = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];
  avatarUrl = 'assets/demo/images/avatar/avadefaut.jpg';
  date!: Date;
  uploadedFiles: any[] = [];
  uploadUrl: string;
  resetPasswordForm: any;
  changePassword: any;
  fileUploader: any;
  loading = false;
  uploadedAvatarUrl: string | null = null;
  profileLoading: any;
  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private messageService: MessageService,
  ) {
    this.uploadUrl = `${userService.apiUrl}/image`;
  }

  ngOnInit(): void {
    this.loading = true;
    this.initializeForms();
    this.initializeMenuItems();
    this.loadUserProfile();
    this.activeItem = this.items[0];
  }

  private initializeForms(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      avatarPath: [''],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  private initializeMenuItems(): void {
    this.items = [
      {
        label: 'Account',
        icon: 'pi pi-fw pi-user',
        command: () => this.selectPage('account'),
      },
      {
        label: 'Password',
        icon: 'pi pi-fw pi-key',
        command: () => this.selectPage('password'),
      },
    ];
  }

  private loadUserProfile(): void {
    this.loading = true;
    this.email = this.authenticationService.getEmailFromToken();
    if (this.email) {
      // Ensure email is not null before using it
      setTimeout(() => {
        this.userService.getUserByEmail(this.email!).subscribe(
          response => {
            this.loading = false;
            if (response.isSucceed && response.result) {
              this.profileForm.patchValue({
                firstName: response.result.firstName,
                lastName: response.result.lastName,
                dob: response.result.dob,
                gender: response.result.gender,
                avatarPath: response.result.avatarPath,
              });
              this.avatarUrl = response.result.avatarPath || this.avatarUrl;
              this.date = response.result.dob
                ? new Date(response.result.dob)
                : new Date();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.message,
              });
            }
          },
          error => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to load user profile.',
            });
          },
        );
      }, 2000);
    } else {
      this.loading = false;
    }
  }

  triggerFileUpload(): void {
    this.fileUploader?.fileInput?.nativeElement.click();
  }

  onAvatarUpload(event: any): void {
    this.loading = true;
    const file = event.files[0];
    if (file && this.validateFile(file)) {
      this.userService.uploadImage(file).subscribe(
        response => {
          this.loading = false;
          if (response.isSucceed && response.result) {
            const uploadedUrl = response.result.url;

            this.avatarUrl = uploadedUrl;
            this.uploadedAvatarUrl = uploadedUrl;

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail:
                'Avatar uploaded successfully. Please click "Update" to save changes.',
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
            });
          }
        },
        error => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to upload avatar.',
          });
        },
      );
    } else {
      this.loading = false;
    }
  }

  onUploadError(event: any): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while uploading the file.',
    });
  }

  updateProfile(): void {
    if (this.profileForm.valid && this.email) {
      this.loading = true;
      const profileData = this.profileForm.value;

      if (this.uploadedAvatarUrl) {
        profileData.avatarPath = this.uploadedAvatarUrl;
      }

      if (profileData.dob) {
        const dob = new Date(profileData.dob);
        profileData.dob = dob.toISOString().split('T')[0];
      }

      this.userService.updateUserProfile(this.email!, profileData).subscribe(
        response => {
          this.loading = false;
          if (response.isSucceed) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Profile updated successfully.',
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
            });
          }
        },
        error => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error updating profile.',
          });
        },
      );
    }
  }

  resetProfileForm(): void {
    this.profileForm.reset();
    this.loadUserProfile();
  }

  selectPage(page: string): void {
    this.activeItem =
      this.items.find(item => item.label?.toLowerCase() === page) ??
      this.items[0];
  }

  private validateFile(file: File): boolean {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (!allowedTypes.includes(file.type)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Only JPG, JPEG, and PNG files are allowed',
      });
      return false;
    }
    if (file.size > maxSizeInBytes) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'File size exceeds 5MB limit',
      });
      return false;
    }
    return true;
  }
}
