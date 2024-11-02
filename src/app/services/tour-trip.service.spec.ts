import { TestBed } from '@angular/core/testing';

import { TourTripService } from './tour-trip.service';

describe('TourTripService', () => {
  let service: TourTripService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourTripService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
