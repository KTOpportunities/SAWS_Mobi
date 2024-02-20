import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnuallyPage } from './annually.page';

describe('AnnuallyPage', () => {
  let component: AnnuallyPage;
  let fixture: ComponentFixture<AnnuallyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AnnuallyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
