import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AviationHomePage } from './aviation-home.page';

const routes: Routes = [
  {
    path: '',
    component: AviationHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AviationHomePageRoutingModule {}
