import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { PaymentTypePage } from './payment-type.page';

describe('PaymentTypePage', () => {
  let component: PaymentTypePage;
  let fixture: ComponentFixture<PaymentTypePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PaymentTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
