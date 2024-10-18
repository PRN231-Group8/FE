import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class MapApiService {

    constructor(private http: HttpClient) {}

    getCities(): Observable<any> {
      return this.http.get<Observable<any>>('assets/demo/data/vn.json');
  }
}