import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-exploration',
  templateUrl: './exploration.component.html',
})
export class ExplorationComponent implements OnInit {
  filters: any = {};
  tours: any[] = [];  // Placeholder for filtered tour data

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    // Retrieve filters from the shared service
    this.filters = this.commonService.getSearchCriteria();
    console.log('Retrieved filters:', this.filters);

    // Use these filters to fetch filtered tours (mock or API call)
    this.fetchFilteredTours();
  }

  fetchFilteredTours(): void {
    // Example logic: filter tours based on criteria (this is just a placeholder)
    // In real-world, you might call an API and pass filters to get the tours
    this.tours = [
      { name: 'Tour 1', price: 1000000, transport: 'Car (4 seats)' },
      { name: 'Tour 2', price: 1500000, transport: 'Bus' },
    ];
    console.log('Displaying filtered tours:', this.tours);
  }
}
