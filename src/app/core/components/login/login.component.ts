import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api'; // Import MessageService
import { ToastModule } from 'primeng/toast'; // Import ToastModule

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastModule],
  providers: [MessageService], // Thêm MessageService vào providers
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
    private messageService: MessageService, // Inject MessageService
  ) {}

  ngOnInit(): void {
    // Form đăng nhập
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // Form đăng ký
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  // Đăng nhập
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true; // Bắt đầu hiển thị vòng xoay và khóa nút

    const { username, password } = this.loginForm.value;

    this.authenticationService.login(username, password).subscribe({
      next: user => {
        // Hiển thị thông báo đăng nhập thành công
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login successful',
        });

        // Trì hoãn 3 giây trước khi điều hướng
        setTimeout(() => {
          if (user.role === 'ADMIN') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
          this.loading = false; // Bỏ khóa nút sau khi điều hướng
        }, 3000); // 3000ms = 3 giây
      },
      error: error => {
        this.error = error;
        this.loading = false; // Bỏ khóa nút khi có lỗi
        // Hiển thị thông báo lỗi
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Login failed',
        });
      },
    });
  }

  // Đăng ký
  onSignUpSubmit(): void {
    if (this.signUpForm.invalid) {
      return;
    }

    this.loading = true; // Khóa nút và hiển thị vòng xoay
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
              detail: 'Registration successful',
            });

            // Trì hoãn 3 giây trước khi điều hướng
            setTimeout(() => {
              this.router.navigate(['/']);
              this.loading = false; // Mở khóa nút sau khi điều hướng
            }, 3000); // 3000ms = 3 giây
          }
        },
        error: () => {
          this.error = 'Registration failed, please try again.';
          this.loading = false; // Mở khóa nút khi có lỗi
          // Hiển thị thông báo lỗi
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
