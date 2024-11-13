import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse } from '../interfaces/models/base-response';
import { CallbackResponse } from '../interfaces/models/callback-response';
import { BookingHistoryResponse } from '../interfaces/models/response/bookingHistoryResponse';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly apiUrl = `${environment.BACKEND_API_URL}/api/payments`;

  constructor(private http: HttpClient) { }

  createPayment(tourTripId: Guid, numberOfPassengers: number): Observable<BaseResponse<string>> {
    return this.http.post<BaseResponse<string>>(`${this.apiUrl}`, { tourTripId, numberOfPassengers });
  }

  callBack(query: string): Observable<BaseResponse<CallbackResponse>> {
    return this.http.get<BaseResponse<CallbackResponse>>(`${this.apiUrl}/callback?${query}`);
  }

  getBookingHistory(pageNumber: number, pageSize: number, filterStatus?: string, searchTerm?: string): Observable<BaseResponse<BookingHistoryResponse>> {
    let params = new HttpParams()
    .set('page-number', pageNumber)
    .set('page-size', pageSize);

    if (filterStatus) {
      params = params.set('filter-status', filterStatus);
    }
    if (searchTerm) {
      params = params.set('search-term', searchTerm);
    }
    return this.http.get<BaseResponse<BookingHistoryResponse>>(`${this.apiUrl}/booking-history`, { params });
  }
}