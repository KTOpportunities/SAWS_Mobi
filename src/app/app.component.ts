import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../app/services/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  logout() {
    this.authService.setLoggedInStatus(false);
    this.router.navigate(['/login']);
  }
  login() {
    this.router.navigate(['/login']);
  }
  isLogged: boolean = false;
  constructor(
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}
  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  onDropdownChange(event: any) {
    const selectedValue = event.target.value;

    switch (selectedValue) {
      case 'About us':
        this.router.navigate(['/login']);
        break;
      case 'Aviation Code':
        this.router.navigate(['/aviation-code']);
        break;
      case 'Contact Us':
        this.router.navigate(['/contact-us']);
        break;
      case 'Related Links':
        window.location.href = 'http://aviation.weathersa.co.za/#links';

        break;
      case 'News':
        this.router.navigate(['/news']);
        break;
      case 'Provide Feedback':
        this.router.navigate(['/provide-feedback']);
        break;
      case 'Subscription Packages':
        this.router.navigate(['/subscription-package']);
        break;
      case 'Terms and Conditions':
        window.location.href =
          'http://aviation.weathersa.co.za/#termsAndConditions';
        break;
      case 'POPIA':
        window.location.href = 'http://www.weathersa.co.za/home/popia';
        break;

      default:
        break;
    }
  }
}
