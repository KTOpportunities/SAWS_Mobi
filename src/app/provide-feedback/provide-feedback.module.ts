import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProvideFeedbackPageRoutingModule } from './provide-feedback-routing.module';

import { ProvideFeedbackPage } from './provide-feedback.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProvideFeedbackPageRoutingModule
  ],
  declarations: [ProvideFeedbackPage]
})
export class ProvideFeedbackPageModule {}
