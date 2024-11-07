import { TestBed } from '@angular/core/testing';

import { TourTimestampService } from './tour-timestamp.service';

describe('TourTimestampService', () => {
  let service: TourTimestampService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourTimestampService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
