import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObservationPage } from './observation.page';

const routes: Routes = [
  {
    path: '',
    component: ObservationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ObservationPageRoutingModule {}
