import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ColorCodedPage } from './color-coded.page';

const routes: Routes = [
  {
    path: '',
    component: ColorCodedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ColorCodedPageRoutingModule {}
