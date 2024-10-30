import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse } from '../interfaces/models/base-response';
import { Location } from '../interfaces/models/location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  getLocations(pageNumber: number, pageSize: number, sortByStatus?: string, searchTerm?: string) : Observable<BaseResponse<Location>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (searchTerm && searchTerm !== '') {
      params = params.set('searchTerm', searchTerm);
    }
    return this.http.get<BaseResponse<Location>>(`${environment.BACKEND_API_URL}/api/locations`, { params });
  }

  getLocationById(id: Guid): Observable<BaseResponse<Location>> {
    return this.http.get<BaseResponse<Location>>(`${environment.BACKEND_API_URL}/api/locations/${id}`);
  }

  createMood(locationToCreate: Location): Observable<BaseResponse<Location>> {
    return this.http.post<BaseResponse<Location>>(`${environment.BACKEND_API_URL}/api/locations`, locationToCreate);
  }

  updateLocations(locationToUpdate: Location): Observable<BaseResponse<Location>> {
    return this.http.put<BaseResponse<Location>>(`${environment.BACKEND_API_URL}/api/locations/${locationToUpdate.id}`, locationToUpdate);
  }

  deleteMood(id: Guid): Observable<BaseResponse<Location>> {
    return this.http.delete<BaseResponse<Location>>(`${environment.BACKEND_API_URL}/api/locations/${id}`);
  }
}
