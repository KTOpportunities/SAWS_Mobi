import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { advisoriesRoutingModule } from './advisories-routing.module';

import { AdvisoriesComponent } from './advisories.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    advisoriesRoutingModule
  ],
  declarations: [AdvisoriesComponent]
})
export class advisoriesPageModule {}
