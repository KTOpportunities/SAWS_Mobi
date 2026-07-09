// Import necessary Angular modules
import { Injectable, NgModule } from '@angular/core';
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
} from '@angular/platform-browser';
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
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { HammerModule } from '@angular/platform-browser';
import { HammerGestureConfig } from '@angular/platform-browser';

import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';



@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  override overrides = {
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}

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
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,

  HammerModule
],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    InAppBrowser,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {} // AppModule class that acts as the root NgModule of the application
