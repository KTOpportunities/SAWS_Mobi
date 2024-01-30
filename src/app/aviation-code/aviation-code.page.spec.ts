import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AviationCodePage } from './aviation-code.page';

describe('AviationCodePage', () => {
  let component: AviationCodePage;
  let fixture: ComponentFixture<AviationCodePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AviationCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
