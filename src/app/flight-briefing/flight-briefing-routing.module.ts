import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlightBriefingPage } from './flight-briefing.page';

const routes: Routes = [
  {
    path: '',
    component: FlightBriefingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlightBriefingPageRoutingModule {}
