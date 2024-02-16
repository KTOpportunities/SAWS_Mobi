import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlightBriefingPage } from './flight-briefing.page';

describe('FlightBriefingPage', () => {
  let component: FlightBriefingPage;
  let fixture: ComponentFixture<FlightBriefingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FlightBriefingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
