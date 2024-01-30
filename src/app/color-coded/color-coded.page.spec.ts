import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorCodedPage } from './color-coded.page';

describe('ColorCodedPage', () => {
  let component: ColorCodedPage;
  let fixture: ComponentFixture<ColorCodedPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ColorCodedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
