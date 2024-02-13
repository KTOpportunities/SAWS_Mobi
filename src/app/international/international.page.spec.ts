import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternationalPage } from './international.page';

describe('InternationalPage', () => {
  let component: InternationalPage;
  let fixture: ComponentFixture<InternationalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InternationalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
