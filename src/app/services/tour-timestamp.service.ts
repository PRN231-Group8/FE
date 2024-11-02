import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse } from '../interfaces/models/base-response';
import { TourTimestamp } from '../interfaces/models/tour-timestamp';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class TourTimestampService {
  private readonly apiUrl = `${environment.BACKEND_API_URL}/api/tour-timestamps`;

  constructor(private http: HttpClient) {}

  getAllTourTimestamps(
    page: number = 1,
    pageSize: number = 10,
    sortByTime?: string,
    searchTerm?: string
  ): Observable<BaseResponse<TourTimestamp[]>> {
    let params = new HttpParams()
      .set('page-number', page.toString())
      .set('page-size', pageSize.toString());

    if (sortByTime) {
      params = params.set('sort-time', sortByTime);
    }
    if (searchTerm) {
      params = params.set('search-term', searchTerm);
    }

    return this.http.get<BaseResponse<TourTimestamp[]>>(this.apiUrl, { params });
  }

  getTourTimestampById(id: Guid): Observable<BaseResponse<TourTimestamp>> {
    return this.http.get<BaseResponse<TourTimestamp>>(`${this.apiUrl}/${id}`);
  }

  getTourTimestampsByTourId(tourId: Guid): Observable<BaseResponse<TourTimestamp[]>> {
    return this.http.get<BaseResponse<TourTimestamp[]>>(`${this.apiUrl}/${tourId}/tour`);
  }

  createBatchTourTimestamps(
    tourTimestamps: TourTimestamp[],
    durationMinutes: number
  ): Observable<BaseResponse<TourTimestamp>> {
    return this.http.post<BaseResponse<TourTimestamp>>(`${this.apiUrl}/${durationMinutes}`, tourTimestamps);
  }

  updateTourTimestamp(id: Guid, tourTimestamp: TourTimestamp): Observable<BaseResponse<TourTimestamp>> {
    return this.http.put<BaseResponse<TourTimestamp>>(`${this.apiUrl}/${id}`, tourTimestamp);
  }

  deleteTourTimestamp(id: Guid): Observable<BaseResponse<boolean>> {
    return this.http.delete<BaseResponse<boolean>>(`${this.apiUrl}/${id}`);
  }
}
