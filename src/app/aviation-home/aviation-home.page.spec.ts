import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AviationHomePage } from './aviation-home.page';

describe('AviationHomePage', () => {
  let component: AviationHomePage;
  let fixture: ComponentFixture<AviationHomePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AviationHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
