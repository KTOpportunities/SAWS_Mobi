import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WebCamPageRoutingModule } from './web-cam-routing.module';

import { WebCamPage } from './web-cam.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WebCamPageRoutingModule
  ],
  declarations: [WebCamPage]
})
export class WebCamPageModule {}
