import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ColorCodedPageRoutingModule } from './color-coded-routing.module';

import { ColorCodedPage } from './color-coded.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ColorCodedPageRoutingModule
  ],
  declarations: [ColorCodedPage]
})
export class ColorCodedPageModule {}
