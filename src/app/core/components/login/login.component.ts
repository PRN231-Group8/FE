import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import {
  GoogleSigninButtonModule,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { AuthenticationGoogleService } from '../../../services/authentication.google.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ExternalAuthRequest } from '../../../interfaces/models/request/externalAuthRequest';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    GoogleSigninButtonModule,
  ],
  providers: [MessageService],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  signUpForm!: FormGroup;
  loading = false;
  error = '';
  signUpMode: boolean = false;
  socialUser!: SocialUser;
  showError?: boolean;
  errorMessage: string = '';
  isGoogleLoading: boolean = false;

  constructor(
    private googleCommonService: AuthenticationGoogleService,
    private socialAuthService: SocialAuthService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });

    this.socialAuthService.authState.subscribe(user => {
      this.socialUser = user;
      if (user) {
        this.externalLogin(user);
      }
    });
  }

  // Destoy loading for google login
  ngOnDestroy(): void {
    this.setGoogleLoading(false);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      if (this.loginForm.get('username')?.hasError('required')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Username is required',
        });
      }
      if (this.loginForm.get('password')?.hasError('required')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Password is required',
        });
      }
      return;
    }

    this.loading = true;
    const { username, password } = this.loginForm.value;

    this.authenticationService.login(username, password).subscribe({
      next: user => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login successful',
        });
        setTimeout(() => {
          this.router.navigate([user.role === 'ADMIN' ? '/dashboard' : '/']);
          this.loading = false;
        }, 3000);
      },
      error: error => {
        this.error = error;
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Login failed',
        });
      },
    });
  }

  onSignUpSubmit(): void {
    if (this.signUpForm.invalid) {
      if (this.signUpForm.get('firstName')?.hasError('required')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'First name is required',
        });
      }
      if (this.signUpForm.get('lastName')?.hasError('required')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Last name is required',
        });
      }
      if (this.signUpForm.get('username')?.hasError('required')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'User name is required',
        });
      }
      if (this.signUpForm.get('email')?.hasError('required')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Email is required',
        });
      }
      if (this.signUpForm.get('password')?.hasError('required')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Password is required',
        });
      }
      if (this.signUpForm.get('confirmPassword')?.hasError('required')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Confirm password is required',
        });
      }
      return;
    }

    this.loading = true;
    const { firstName, lastName, username, email, password, confirmPassword } =
      this.signUpForm.value;

    this.authenticationService
      .register({
        firstName,
        lastName,
        username,
        email,
        password,
        confirmPassword,
      })
      .subscribe({
        next: response => {
          if (response.isSucceed) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Registration successful, please verify your email.',
            });

            setTimeout(() => {
              this.onSignInClick();
              this.loading = false;
            }, 3000);
          }
        },
        error: () => {
          this.error = 'Registration failed, please try again.';
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Registration failed',
          });
        },
      });
  }

  onSignUpClick(): void {
    this.signUpMode = true;
  }

  onSignInClick(): void {
    this.signUpMode = false;
  }

  // Login Google
  private externalLogin(user: SocialUser): void {
    this.showError = false;
    if (!user || !user.provider || !user.idToken) {
      return;
    }
    const externalAuth: ExternalAuthRequest = {
      provider: user.provider,
      idToken: user.idToken,
    };
    this.setGoogleLoading(true);
    this.validateExternalAuth(externalAuth);
  }

  private validateExternalAuth(externalAuth: ExternalAuthRequest): void {
    this.googleCommonService
      .externalLogin('/api/auth/google', externalAuth)
      .subscribe({
        next: res => {
          if (res && res.token) {
            localStorage.setItem('socialUser', JSON.stringify(res));
            this.authenticationService.setUserValue(res);

            // Show success toast
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Google login successful',
            });

            // Delay navigation to allow toast to be seen
            setTimeout(() => {
              if (res.role === 'ADMIN') {
                this.router.navigate(['/dashboard']);
              } else {
                this.router.navigate(['/']);
              }
              this.setGoogleLoading(false);
            }, 2000);
          } else {
            this.handleError('Invalid response from server');
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('External login error:', err);
          let errorMsg = 'An error occurred during login';
          if (err.error instanceof ErrorEvent) {
            errorMsg = `Error: ${err.error.message}`;
          } else {
            errorMsg = `Error Code: ${err.status}\nMessage: ${err.error?.message || err.message}`;
          }
          this.handleError(errorMsg);
          this.setGoogleLoading(false);
        },
        complete: () => {
          console.log('External login observable completed');
        },
      });
  }

  setGoogleLoading(isLoading: boolean): void {
    this.isGoogleLoading = isLoading;
  }

  private handleError(message: string): void {
    this.errorMessage = message;
    this.showError = true;
    console.error(this.errorMessage);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: this.errorMessage,
    });
    this.googleCommonService.signOutExternal();
  }
}
