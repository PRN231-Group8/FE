import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DashboardResponse } from '../interfaces/models/dashboard-response';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `${environment.BACKEND_API_URL}/api/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(this.apiUrl);
  }
}
