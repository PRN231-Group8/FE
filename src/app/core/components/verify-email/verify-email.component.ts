import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MessageService } from 'primeng/api';
import { BaseResponse } from '../../../interfaces/models/base-response';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  email: string | null = null;
  token: string | null = null;
  verificationMessage: string = 'Verifying your email, please wait...';
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.email = params.get('email');
      this.token = params.get('token');

      if (this.email && this.token) {
        this.verifyEmail();
      } else {
        this.verificationMessage = 'Invalid verification link.';
        this.loading = false;
      }
    });
  }

  verifyEmail(): void {
    const url = `${
      environment.BACKEND_API_URL
    }/api/auth/verify-email?email=${encodeURIComponent(
      this.email!,
    )}&token=${encodeURIComponent(this.token!)}`;
    this.http.get<BaseResponse<any>>(url).subscribe({
      next: (response: BaseResponse<any>) => {
        this.verificationMessage = response.message;
        this.loading = false;

        if (response.isSucceed) {
          this.messageService.add({
            severity: 'success',
            summary: 'Done',
            detail: 'Verification successful!',
            life: 3000,
          });
        }
      },
      error: error => {
        this.verificationMessage =
          error.error?.message || 'Verification failed.';
        this.loading = false;
      },
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
