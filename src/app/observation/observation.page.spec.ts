import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObservationPage } from './observation.page';

describe('ObservationPage', () => {
  let component: ObservationPage;
  let fixture: ComponentFixture<ObservationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ObservationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
