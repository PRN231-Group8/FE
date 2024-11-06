import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse } from '../interfaces/models/base-response';
import { PhotoResponse } from '../interfaces/models/response/photoResponse';
import { UpdatePhotoRequest } from '../interfaces/models/request/photoRequest';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private apiUrl = `${environment.BACKEND_API_URL}/api/photos`;

  constructor(private http: HttpClient) {}

  // Method for updating a photo
  updatePhoto(
    updateRequest: UpdatePhotoRequest,
  ): Observable<BaseResponse<PhotoResponse>> {
    const formData = new FormData();
    formData.append('photoId', updateRequest.photoId);
    formData.append('postId', updateRequest.postId);
    formData.append('file', updateRequest.file);

    return this.http.put<BaseResponse<PhotoResponse>>(
      `${this.apiUrl}`,
      formData,
    );
  }

  // Method for retrieving a photo by its id
  getPhotoById(id: string): Observable<BaseResponse<PhotoResponse>> {
    return this.http.get<BaseResponse<PhotoResponse>>(`${this.apiUrl}/${id}`);
  }
}
