// Import necessary Angular modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';


@NgModule({
  // Declarations: Components, Directives, and Pipes declared in this module
  declarations: [AppComponent],

  // Imports: Other modules whose exported classes are needed by component templates declared in this NgModule
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    ReactiveFormsModule,
    HttpClientModule, 
    NoopAnimationsModule, 
    MatSlideToggleModule, 
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatListModule,
  
    // SwiperModule,
  ],

 
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy } // Ionic Route Strategy
  ],

  // Bootstrap: The main application view, called the root component, that hosts all other app views
  bootstrap: [AppComponent],
})
export class AppModule {} // AppModule class that acts as the root NgModule of the application
