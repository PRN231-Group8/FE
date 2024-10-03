import { Component, OnInit } from '@angular/core';
import { ExternalAuthRequest } from '../../../../interfaces/models/request/externalAuthRequest';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../../../../services/authentication.service';
import { AuthenticationGoogleService } from '../../../../services/authentication.google.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  socialUser!: SocialUser;
  showError?: boolean;
  errorMessage: string = '';

  constructor(
    private authenticationService: AuthenticationService,
    private googleCommonService: AuthenticationGoogleService,
    private socialAuthService: SocialAuthService,
    private router: Router,
  ) {}

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  ngOnInit() {
    this.socialAuthService.authState.subscribe(user => {
      this.socialUser = user;
      if (user) {
        this.externalLogin(user);
      }
    });
  }

  private externalLogin(user: SocialUser): void {
    this.showError = false;
    if (!user || !user.provider || !user.idToken) {
      return;
    }
    const externalAuth: ExternalAuthRequest = {
      provider: user.provider,
      idToken: user.idToken,
    };
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
            this.router
              .navigate(['/dashboard'])
              .then(() => {
                console.log('Navigation complete');
              })
              .catch(err => {
                console.error('Navigation error:', err);
              });
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
            errorMsg = `Error Code: ${err.status}\nMessage: ${err.message}`;
          }
          this.handleError(errorMsg);
        },
        complete: () => {
          console.log('External login observable completed');
        },
      });
  }

  private handleError(message: string): void {
    this.errorMessage = message;
    this.showError = true;
    console.error(this.errorMessage);
    this.googleCommonService.signOutExternal();
  }
}
