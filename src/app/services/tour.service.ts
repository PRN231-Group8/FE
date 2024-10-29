import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tour } from '../interfaces/models/tour';
import { environment } from '../../environments/environment';
import { BaseResponse } from '../interfaces/models/base-response';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class TourService {

  constructor(private http: HttpClient) { }

  getTours(pageNumber: number, pageSize: number, sortByStatus?: string, searchTerm?: string) : Observable<BaseResponse<Tour>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (searchTerm && searchTerm !== '') {
      params = params.set('searchTerm', searchTerm);
    }
    return this.http.get<BaseResponse<Tour>>(`${environment.BACKEND_API_URL}/api/tours`, { params });
  }

  getTourById(id: Guid): Observable<BaseResponse<Tour>> {
    return this.http.get<BaseResponse<Tour>>(`${environment.BACKEND_API_URL}/api/tours/${id}`);
  }

  createTour(tourToCreate: Tour): Observable<BaseResponse<Tour>> {
    return this.http.post<BaseResponse<Tour>>(`${environment.BACKEND_API_URL}/api/tours`, tourToCreate);
  }

  updateTour(tourToUpdate: Tour): Observable<BaseResponse<Tour>> {
    return this.http.put<BaseResponse<Tour>>(`${environment.BACKEND_API_URL}/api/tours/${tourToUpdate.id}`, tourToUpdate);
  }

  deleteTour(id: Guid): Observable<BaseResponse<Tour>> {
    return this.http.delete<BaseResponse<Tour>>(`${environment.BACKEND_API_URL}/api/tours/${id}`);
  }
}
