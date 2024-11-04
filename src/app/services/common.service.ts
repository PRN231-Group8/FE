import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tour } from '../interfaces/models/tour';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private searchCriteria: any = {};
  private toursSubject = new BehaviorSubject<Tour[] | null>(null);
  tours$ = this.toursSubject.asObservable();

  // Save the search criteria
  setSearchCriteria(criteria: any): void {
    this.searchCriteria = criteria;
  }
  // Get the search criteria
  getSearchCriteria(): any {
    return this.searchCriteria;
  }

  // Store fetched tours in BehaviorSubject
  setTours(tours: Tour[]): void {
    this.toursSubject.next(tours);
  }

  // Get stored tours as an Observable
  getTours(): Observable<Tour[] | null> {
    return this.toursSubject.asObservable();
  }
}
