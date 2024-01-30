import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProvideFeedbackPage } from './provide-feedback.page';

describe('ProvideFeedbackPage', () => {
  let component: ProvideFeedbackPage;
  let fixture: ComponentFixture<ProvideFeedbackPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProvideFeedbackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
