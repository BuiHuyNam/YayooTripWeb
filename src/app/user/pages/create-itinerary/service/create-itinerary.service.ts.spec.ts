import { TestBed } from '@angular/core/testing';

import { CreateItineraryServiceTs } from './create-itinerary.service.ts';

describe('CreateItineraryServiceTs', () => {
  let service: CreateItineraryServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateItineraryServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
