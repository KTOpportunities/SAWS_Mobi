import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebCamPage } from './web-cam.page';

describe('WebCamPage', () => {
  let component: WebCamPage;
  let fixture: ComponentFixture<WebCamPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WebCamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
