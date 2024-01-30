import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../app/services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'ABOUT', url: '/folder/inbox' },
    { title: 'HOME', url: '/folder/outbox' },
    { title: 'QUERIES', url: '/folder/favorites' },
    { title: 'DOMESTIC', url: '/folder/archived' },
    { title: 'FORECAST', url: '/folder/trash' },
    { title: 'AEROSPORT', url: '/folder/spam' },
    { title: 'OBSERVATION', url: '/folder/spam' },
    { title: 'INTERNATIONAL', url: '/folder/spam' },
    { title: 'FLIGHT BRIEFING', url: '/folder/spam', icon: 'warning' },
  ];
  public LOGOUT = ['LOGOUT'];

  logout() {
    this.authService.setLoggedInStatus(false);
    this.router.navigate(['/login']);
  }
  login() {
    this.router.navigate(['/login']);
  }
  isLogged: boolean = false;
  constructor(private router: Router, private authService: AuthService) {}
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
        this.router.navigate(['/login']);
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
        this.router.navigate(['/login']);
        break;
      case 'POPIA':
        this.router.navigate(['/login']);
        break;
      // Add more cases for other options

      default:
        // Do nothing or handle default case
        break;
    }
  }
}
