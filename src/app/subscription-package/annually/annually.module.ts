import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnnuallyPageRoutingModule } from './annually-routing.module';

import { AnnuallyPage } from './annually.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnnuallyPageRoutingModule
  ],
  declarations: [AnnuallyPage]
})
export class AnnuallyPageModule {}
