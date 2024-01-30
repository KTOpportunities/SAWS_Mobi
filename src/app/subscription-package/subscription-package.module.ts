import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubscriptionPackagePageRoutingModule } from './subscription-package-routing.module';

import { SubscriptionPackagePage } from './subscription-package.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubscriptionPackagePageRoutingModule
  ],
  declarations: [SubscriptionPackagePage]
})
export class SubscriptionPackagePageModule {}
