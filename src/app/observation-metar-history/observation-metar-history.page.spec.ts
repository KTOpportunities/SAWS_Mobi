import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObservationMetarHistoryPage } from './observation-metar-history.page';

describe('ObservationMetarHistoryPage', () => {
  let component: ObservationMetarHistoryPage;
  let fixture: ComponentFixture<ObservationMetarHistoryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ObservationMetarHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
