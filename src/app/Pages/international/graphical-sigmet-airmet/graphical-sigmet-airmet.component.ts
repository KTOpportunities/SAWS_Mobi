import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import {
  InAppBrowser,
  InAppBrowserObject,
  InAppBrowserOptions
} from '@awesome-cordova-plugins/in-app-browser/ngx';

import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-graphical-sigmet-airmet',
  templateUrl: './graphical-sigmet-airmet.component.html',
  styleUrls: ['./../international.page.scss'],
})
export class GraphicalSigmetAirmetComponent implements OnInit, OnDestroy {

  loading: boolean = true;

  private browser: InAppBrowserObject | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private iab: InAppBrowser,
    private platform: Platform
  ) {}

  ngOnInit() {

    if (!this.authService.getIsLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.platform.ready().then(() => {
      this.openGraphicalMap();
    });
  }

  ngOnDestroy() {

    if (this.browser) {
      this.browser.close();
      this.browser = null;
    }
  }

  openGraphicalMap() {

    this.loading = true;

    const url =
      'https://aviation.weathersa.co.za/#showGraphicalSigmet';

    const options: InAppBrowserOptions = {
      location: 'no',
      toolbar: 'yes',
      toolbarcolor: '#1a3a6e',
      closebuttoncaption: 'Back to App',
      closebuttoncolor: '#ffffff',
      zoom: 'yes',
      hardwareback: 'yes',
      hidespinner: 'no',
      presentationstyle: 'fullscreen'
    };

    this.browser = this.iab.create(
      url,
      '_blank',
      options
    );

    this.browser.on('loadstop').subscribe(() => {
      this.loading = false;
    });

    this.browser.on('loaderror').subscribe((event) => {

      console.error('Browser load error', event);

      this.loading = false;
    });

    this.browser.on('exit').subscribe(() => {

      this.loading = false;
      this.browser = null;

      // Go back to International page
      this.router.navigateByUrl('/international', {
        replaceUrl: true
      });
    });
  }

  NavigateToInternational() {

    if (this.browser) {
      this.browser.close();
      this.browser = null;
    }

    this.router.navigateByUrl('/international', {
      replaceUrl: true
    });
  }
}