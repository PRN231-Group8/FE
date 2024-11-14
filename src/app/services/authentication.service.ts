import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/models/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { BaseResponse } from '../interfaces/models/base-response';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
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
    const storedUserString = localStorage.getItem('user');
    let storedUser: User | null = null;

    // Kiểm tra nếu user tồn tại và không phải là 'undefined'
    if (storedUserString && storedUserString !== 'undefined') {
      try {
        storedUser = JSON.parse(storedUserString);
        if (storedUser?.token) {
          const decodedToken: any = jwtDecode(storedUser.token);
          storedUser.firstName = decodedToken.FirstName;
          storedUser.lastName = decodedToken.LastName;
        }
      } catch (error) {
        console.error('Error parsing stored user JSON:', error);
        storedUser = null; // Nếu JSON không hợp lệ, đặt giá trị là null
      }
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

  register(payload: any): Observable<BaseResponse<User>> {
    return this.http.post<BaseResponse<User>>(
      `${environment.BACKEND_API_URL}/api/auth/register`,
      payload,
    );
  }

  login(username: string, password: string): Observable<User> {
    return this.http
      .post<any>(`${environment.BACKEND_API_URL}/api/auth/login`, {
        username,
        password,
      })
      .pipe(
        map(user => {
          if (user.isSucceed) {
            const decodedToken: any = jwtDecode(user.token);
            user.firstName = decodedToken.FirstName;
            user.lastName = decodedToken.LastName;
            user.email = decodedToken.email;

            // Chỉ lưu vào localStorage khi user có giá trị hợp lệ
            if (user && user.token) {
              localStorage.setItem('user', JSON.stringify(user));
              this.userSubject.next(user);
            }
          }
          return user;
        }),
      );
  }
  logOut(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('socialUser');
    this.userSubject.next(null);
    this.socialAuthService.signOut();
    this.router.navigate(['/login']);
  }
  public getEmailFromToken(): string | null {
    const user = this.userSubject.value;
    console.log(user);
    if (user && user.token) {
      return user.email ?? null;
    }
    return null;
  }
}
