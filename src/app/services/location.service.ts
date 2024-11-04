import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse } from '../interfaces/models/base-response';
import { Location } from '../interfaces/models/location';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly baseUrl = `${environment.BACKEND_API_URL}/api/locations`;

  constructor(private http: HttpClient) {}

  getLocations(
    pageNumber: number,
    pageSize: number,
    sortByStatus?: string,
    searchTerm?: string,
  ): Observable<BaseResponse<Location>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (sortByStatus) {
      params = params.set('sortByStatus', sortByStatus);
    }

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<BaseResponse<Location>>(this.baseUrl, { params });
  }

  getLocationById(id: Guid): Observable<BaseResponse<Location>> {
    return this.http.get<BaseResponse<Location>>(`${this.baseUrl}/${id}`);
  }

  createLocation(locationData: FormData): Observable<BaseResponse<Location>> {
    return this.http.post<BaseResponse<Location>>(
      `${this.baseUrl}`,
      locationData,
    );
  }

  updateLocation(locationData: FormData): Observable<BaseResponse<Location>> {
    return this.http.put<BaseResponse<Location>>(
      `${this.baseUrl}/${locationData.get('id')}`,
      locationData,
    );
  }

  deleteLocation(id: Guid): Observable<BaseResponse<Location>> {
    return this.http.delete<BaseResponse<Location>>(`${this.baseUrl}/${id}`);
  }
}
