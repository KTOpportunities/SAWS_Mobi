import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { SubscriptionPackagePage } from './subscription-package.page';

describe('SubscriptionPackagePage', () => {
  let component: SubscriptionPackagePage;
  let fixture: ComponentFixture<SubscriptionPackagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SubscriptionPackagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
