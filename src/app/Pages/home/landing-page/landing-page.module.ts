import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LandingPage } from './landing-page.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LandingPageRoutingModule,
    SharedModule
  ],
  providers: [
    InAppBrowser
  ],
  declarations: [LandingPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LandingPageModule {}
