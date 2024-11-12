/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../interfaces/models/user';
import { environment } from '../../environments/environment';
import { ExternalAuthRequest } from '../interfaces/models/request/external-auth-request';
import { AuthenticationService } from './authentication.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGoogleService {
  private userSocialSubject!: BehaviorSubject<User | null>;
  public userSocial!: Observable<User | null>;
  private authChangeSub = new Subject<boolean>();
  private extAuthChangeSub = new Subject<SocialUser>();
  public authChanged = this.authChangeSub.asObservable();
  public extAuthChanged = this.extAuthChangeSub.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthenticationService,
    private externalAuthService: SocialAuthService,
  ) {
    this.userSocialSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('socialUser')!),
    );
    this.userSocial = this.userSocialSubject.asObservable();
  }

  public signInWithGoogle = (): void => {
    this.externalAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((user: SocialUser) => {
        this.extAuthChangeSub.next(user);
      })
      .catch(error => {
        console.error('Google Sign-In error', error);
        // Handle sign-in error (e.g., show error message to user)
      });
  };

  public signOutExternal = () => {
    this.externalAuthService.signOut();
    this.clearLocalStorage();
  };

  public clearLocalStorage(): void {
    localStorage.removeItem('socialUser');
    localStorage.removeItem('user');
  }

  public get userSocialValue(): User | null {
    return this.userSocialSubject.value;
  }

  externalLogin(
    route: string,
    externalAuth: ExternalAuthRequest,
  ): Observable<any> {
    const url = `${environment.BACKEND_API_URL}${route}`;
    return this.http.post<any>(url, externalAuth).pipe(
      map(res => {
        if (res.token) {
          const decodedToken: any = jwtDecode(res.token);
          const user: User = {
            email: decodedToken.email,
            firstName: decodedToken.FirstName,
            lastName: decodedToken.LastName,
            phoneNumber: decodedToken.phoneNumber,
            token: res.token,
            role: res.role,
          };

          this.authService.setUserValue(user);
          this.saveSocialUser(user);
        }
        return res;
      }),
      catchError(error => {
        console.error('External login error:', error);
        if (error.error instanceof ErrorEvent) {
          console.error('Client-side error:', error.error.message);
        } else {
          console.error(
            `Backend returned code ${error.status}, body was:`,
            error.error,
          );
        }
        throw error;
      }),
    );
  }

  saveSocialUser(res: any): void {
    const socialUser: User = {
      email: res.email,
      firstName: res.firstName,
      lastName: res.lastName,
      phoneNumber: res.phoneNumber,
      token: res.token,
      role: res.role,
    };
    localStorage.setItem('socialUser', JSON.stringify(socialUser));
    localStorage.setItem('user', JSON.stringify(res));
    this.userSocialSubject.next(socialUser);
  }
}
