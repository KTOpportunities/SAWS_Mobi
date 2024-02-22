import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentTypePageRoutingModule } from './payment-type-routing.module';

import { PaymentTypePage } from './payment-type.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentTypePageRoutingModule
  ],
  declarations: [PaymentTypePage]
})
export class PaymentTypePageModule {}
