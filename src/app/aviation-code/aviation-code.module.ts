import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AviationCodePageRoutingModule } from './aviation-code-routing.module';

import { AviationCodePage } from './aviation-code.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AviationCodePageRoutingModule
  ],
  declarations: [AviationCodePage]
})
export class AviationCodePageModule {}
