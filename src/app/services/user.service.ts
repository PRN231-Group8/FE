import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse } from '../interfaces/models/base-response';
import { UserProfileRequest } from '../interfaces/models/request/userProfileRequest';
import { UserProfileResponse } from '../interfaces/models/response/userProfileResponse';
import { User } from '../interfaces/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public apiUrl = `${environment.BACKEND_API_URL}/api/users`;

  constructor(private http: HttpClient) {}

  updateUserProfile(
    id: string,
    model: UserProfileRequest,
  ): Observable<BaseResponse<any>> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<BaseResponse<any>>(url, model);
  }

  uploadImage(file: File): Observable<BaseResponse<any>> {
    const url = `${this.apiUrl}/image`;
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<BaseResponse<any>>(url, formData);
  }
  getUserByEmail(email: string): Observable<BaseResponse<UserProfileResponse>> {
    const url = `${this.apiUrl}/${email}`;
    return this.http.get<BaseResponse<UserProfileResponse>>(url);
  }
  getAllUsers(): Observable<BaseResponse<User[]>> {
    const url = `${this.apiUrl}`;
    return this.http.get<BaseResponse<User[]>>(url);
  }
}
