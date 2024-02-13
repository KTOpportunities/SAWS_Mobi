import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomesticPage } from './domestic.page';

describe('DomesticPage', () => {
  let component: DomesticPage;
  let fixture: ComponentFixture<DomesticPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DomesticPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
