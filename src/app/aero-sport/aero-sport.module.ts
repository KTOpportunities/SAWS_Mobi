import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AeroSportPageRoutingModule } from './aero-sport-routing.module';

import { AeroSportPage } from './aero-sport.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AeroSportPageRoutingModule
  ],
  declarations: [AeroSportPage]
})
export class AeroSportPageModule {}
