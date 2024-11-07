import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse } from '../interfaces/models/base-response';
import { CallbackResponse } from '../interfaces/models/callback-response';

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
}
