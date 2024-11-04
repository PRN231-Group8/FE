import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse } from '../interfaces/models/base-response';
import { environment } from '../../environments/environment';
import { TourTripResponse } from '../interfaces/models/response/tour-trip-response';

@Injectable({
  providedIn: 'root'
})
export class TourTripService {

  private apiUrl = `${environment.BACKEND_API_URL}/api/tour-trips`;

  constructor(private http: HttpClient) { }

  getTourTripsByTourId(tourId: string): Observable<BaseResponse<TourTripResponse>> {
    return this.http.get<BaseResponse<TourTripResponse>>(`${this.apiUrl}/${tourId}/tour`);
  }
}
