import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnnuallyPage } from './annually.page';

const routes: Routes = [
  {
    path: '',
    component: AnnuallyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnnuallyPageRoutingModule {}
