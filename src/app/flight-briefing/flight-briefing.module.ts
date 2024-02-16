import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlightBriefingPageRoutingModule } from './flight-briefing-routing.module';

import { FlightBriefingPage } from './flight-briefing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlightBriefingPageRoutingModule
  ],
  declarations: [FlightBriefingPage]
})
export class FlightBriefingPageModule {}
