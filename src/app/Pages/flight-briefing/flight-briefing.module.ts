import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlightBriefingPageRoutingModule } from './flight-briefing-routing.module';

import { FlightBriefingPage } from './flight-briefing.page';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { SharedModule } from "../../shared/shared.module";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlightBriefingPageRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    SharedModule,
  
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule
  

  ],
  declarations: [FlightBriefingPage]
})
export class FlightBriefingPageModule {}
