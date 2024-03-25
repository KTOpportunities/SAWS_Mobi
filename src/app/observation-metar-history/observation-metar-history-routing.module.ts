import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObservationMetarHistoryPage } from './observation-metar-history.page';

const routes: Routes = [
  {
    path: '',
    component: ObservationMetarHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ObservationMetarHistoryPageRoutingModule {}
