import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AeroSportPage } from './aero-sport.page';

describe('AeroSportPage', () => {
  let component: AeroSportPage;
  let fixture: ComponentFixture<AeroSportPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AeroSportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
