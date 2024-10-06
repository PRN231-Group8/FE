import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  signUpForm!: FormGroup;
  loading = false;
  error = '';
  signUpMode: boolean = false;

  constructor(
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
}
