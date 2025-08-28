import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryView } from './itinerary-view';

describe('ItineraryView', () => {
  let component: ItineraryView;
  let fixture: ComponentFixture<ItineraryView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItineraryView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItineraryView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
