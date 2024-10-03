import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/models/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private socialAuthService: SocialAuthService,
  ) {
    const storedUser = JSON.parse(localStorage.getItem('user')!);
    if (storedUser?.token) {
      const decodedToken: any = jwtDecode(storedUser.token);
      storedUser.firstName = decodedToken.FirstName;
      storedUser.lastName = decodedToken.LastName;
      storedUser.email = decodedToken.email; // Assuming the email claim is present in the token
    }
    this.userSubject = new BehaviorSubject<User | null>(storedUser);
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User | null {
    return this.userSubject.value;
  }

  public setUserValue(user: User | null): void {
    this.userSubject.next(user);
  }

  logOut(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('socialUser');
    this.userSubject.next(null);
    this.socialAuthService.signOut();
    this.router.navigate(['/login']);
  }
}
