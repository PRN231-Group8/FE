import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
    private searchCriteria: any = {};

    // Save the search criteria
    setSearchCriteria(criteria: any): void {
      this.searchCriteria = criteria;
    }
    // Get the search criteria
    getSearchCriteria(): any {
      return this.searchCriteria;
    }
}
