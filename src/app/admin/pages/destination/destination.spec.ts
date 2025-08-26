import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Destinations } from './destination';

describe('Destination', () => {
  let component: Destinations;
  let fixture: ComponentFixture<Destinations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Destinations]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Destinations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
