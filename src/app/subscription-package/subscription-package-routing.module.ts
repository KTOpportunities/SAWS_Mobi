import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubscriptionPackagePage } from './subscription-package.page';

const routes: Routes = [
  {
    path: '',
    component: SubscriptionPackagePage
  },
 
  {
    path: 'payment-type',
    loadChildren: () => import('./payment-type/payment-type.module').then( m => m.PaymentTypePageModule)
  },

  
 

  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionPackagePageRoutingModule {}
