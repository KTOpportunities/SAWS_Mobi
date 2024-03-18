import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ObservationMetarHistoryPageRoutingModule } from './observation-metar-history-routing.module';

import { ObservationMetarHistoryPage } from './observation-metar-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ObservationMetarHistoryPageRoutingModule
  ],
  declarations: [ObservationMetarHistoryPage]
})
export class ObservationMetarHistoryPageModule {}
