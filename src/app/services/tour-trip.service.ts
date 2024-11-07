import { HttpClient, HttpParams } from '@angular/common/http';
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

  // Fetches all tour trips with pagination and optional sorting and search
  getTourTrips(page: number = 1, pageSize: number = 10, sortByPrice?: boolean, searchTerm?: string): Observable<BaseResponse<TourTripResponse[]>> {
    let params = new HttpParams()
      .set('page-number', page.toString())
      .set('page-size', pageSize.toString());
    if (sortByPrice) {
      params = params.set('sort-by-price', sortByPrice);
    }
    if (searchTerm) {
      params = params.set('search-term', searchTerm);
    }

    return this.http.get<BaseResponse<TourTripResponse[]>>(this.apiUrl, { params });
  }

  // Fetch a specific tour trip by ID
  getTourTripById(tourTripId: string): Observable<BaseResponse<TourTripResponse>> {
    return this.http.get<BaseResponse<TourTripResponse>>(`${this.apiUrl}/${tourTripId}`);
  }

  // Fetch tour trips associated with a specific tour ID
  getTourTripsByTourId(tourId: string): Observable<BaseResponse<TourTripResponse>> {
    return this.http.get<BaseResponse<TourTripResponse>>(`${this.apiUrl}/${tourId}/tour`);
  }

  // Create a batch of tour trips (Admin only)
  createBatchTourTrips(requests: any): Observable<BaseResponse<null>> {
    return this.http.post<BaseResponse<null>>(this.apiUrl, requests);
  }

  // Update an existing tour trip by ID (Admin only)
  updateTourTrip(tourTripId: string, request: any): Observable<BaseResponse<null>> {
    return this.http.put<BaseResponse<null>>(`${this.apiUrl}/${tourTripId}`, request);
  }

  // Delete a specific tour trip by ID (Admin only)
  deleteTourTrip(tourTripId: string): Observable<BaseResponse<boolean>> {
    return this.http.delete<BaseResponse<boolean>>(`${this.apiUrl}/${tourTripId}`);
  }
}
