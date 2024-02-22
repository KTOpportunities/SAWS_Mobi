import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentTypePage } from './payment-type.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentTypePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentTypePageRoutingModule {}
