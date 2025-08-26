import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateItinerary } from './create-itinerary';

describe('CreateItinerary', () => {
  let component: CreateItinerary;
  let fixture: ComponentFixture<CreateItinerary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateItinerary]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreateItinerary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
