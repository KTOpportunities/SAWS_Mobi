import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { LandingPage } from './landing-page.page';

describe('LandingPagePage', () => {
  let component: LandingPage;
  let fixture: ComponentFixture<LandingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LandingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
