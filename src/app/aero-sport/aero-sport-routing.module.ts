import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AeroSportPage } from './aero-sport.page';

const routes: Routes = [
  {
    path: '',
    component: AeroSportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AeroSportPageRoutingModule {}
