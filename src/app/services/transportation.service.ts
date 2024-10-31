import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transportation } from '../interfaces/models/transportation';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse } from '../interfaces/models/base-response';

@Injectable({
  providedIn: 'root'
})
export class TransportationService {

  constructor(private http: HttpClient) { }

  getTransportations(pageNumber: number, pageSize: number, sortBy?: string, sortOrder?: string, searchTerm?: string) : Observable<BaseResponse<Transportation>> {
    let params = new HttpParams()
      .set('page-number', pageNumber.toString())
      .set('page-size', pageSize.toString());
    if (searchTerm && searchTerm !== '')
      params = params.set('search-term', searchTerm);
    if (sortBy && sortBy !== '')
      params = params.set('sort-by', sortBy);
    if (sortOrder && sortOrder !== '')
      params = params.set('sort-order', sortOrder);
    return this.http.get<BaseResponse<Transportation>>(`${environment.BACKEND_API_URL}/api/transportations`, { params });
  }

  getTransportationById(id: Guid): Observable<BaseResponse<Transportation>> {
    return this.http.get<BaseResponse<Transportation>>(`${environment.BACKEND_API_URL}/api/transportations/${id}`);
  }

  createTransportation(transportationToCreate: Transportation): Observable<BaseResponse<Transportation>> {
    return this.http.post<BaseResponse<Transportation>>(`${environment.BACKEND_API_URL}/api/transportations`, transportationToCreate);
  }

  updateTransportation(transportationToUpdate: Transportation): Observable<BaseResponse<Transportation>> {
    return this.http.put<BaseResponse<Transportation>>(`${environment.BACKEND_API_URL}/api/transportations/${transportationToUpdate.id}`, transportationToUpdate);
  }

  deleteMood(id: Guid): Observable<BaseResponse<Transportation>> {
    return this.http.delete<BaseResponse<Transportation>>(`${environment.BACKEND_API_URL}/api/transportations/${id}`);
  }
}
