import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WebCamPage } from './web-cam.page';

const routes: Routes = [
  {
    path: '',
    component: WebCamPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebCamPageRoutingModule {}
