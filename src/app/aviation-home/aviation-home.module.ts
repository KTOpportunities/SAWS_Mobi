import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AviationHomePageRoutingModule } from './aviation-home-routing.module';

import { AviationHomePage } from './aviation-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AviationHomePageRoutingModule
  ],
  declarations: [AviationHomePage]
})
export class AviationHomePageModule {}
