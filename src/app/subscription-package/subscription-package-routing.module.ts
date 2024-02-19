import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubscriptionPackagePage } from './subscription-package.page';

const routes: Routes = [
  {
    path: '',
    component: SubscriptionPackagePage
  },  {
    path: 'annually',
    loadChildren: () => import('./annually/annually.module').then( m => m.AnnuallyPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionPackagePageRoutingModule {}
