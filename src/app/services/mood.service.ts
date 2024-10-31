import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mood } from '../interfaces/models/mood';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse } from '../interfaces/models/base-response';

@Injectable({
  providedIn: 'root'
})
export class MoodService {

  constructor(private http: HttpClient) { }

  getMoods(pageNumber: number, pageSize: number, sortByStatus?: string, searchTerm?: string) : Observable<BaseResponse<Mood>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (searchTerm && searchTerm !== '') {
      params = params.set('searchTerm', searchTerm);
    }
    return this.http.get<BaseResponse<Mood>>(`${environment.BACKEND_API_URL}/api/moods`, { params });
  }

  getMoodById(id: Guid): Observable<BaseResponse<Mood>> {
    return this.http.get<BaseResponse<Mood>>(`${environment.BACKEND_API_URL}/api/moods/${id}`);
  }

  createMood(moodToCreate: Mood): Observable<BaseResponse<Mood>> {
    return this.http.post<BaseResponse<Mood>>(`${environment.BACKEND_API_URL}/api/moods`, moodToCreate);
  }

  updateMood(moodToUpdate: Mood): Observable<BaseResponse<Mood>> {
    return this.http.put<BaseResponse<Mood>>(`${environment.BACKEND_API_URL}/api/moods/${moodToUpdate.id}`, moodToUpdate);
  }

  deleteMood(id: Guid): Observable<BaseResponse<Mood>> {
    return this.http.delete<BaseResponse<Mood>>(`${environment.BACKEND_API_URL}/api/moods/${id}`);
  }
}
