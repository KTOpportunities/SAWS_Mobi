import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../app/services/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  userDetails: any;
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
  ngOnInit() {
    const userDetailsString = sessionStorage.getItem('userData');
    if (userDetailsString) {
      this.userDetails = JSON.parse(userDetailsString);
      console.log('USER DETAILS:', this.userDetails);
      console.log('USER DETAILS:', this.userDetails.aspUserName);
    }
  }
  aviationcode() {
    this.router.navigate(['/aviation-code']);
  }
  contactUs() {
    this.router.navigate(['/contact-us']);
  }
  relatedLink() {
    window.location.href = 'http://aviation.weathersa.co.za/#links';
  }
  news() {
    this.router.navigate(['/news']);
  }
  provideFeedback() {
    this.router.navigate(['/provide-feedback']);
  }
  subscriptionPackage() {
    this.router.navigate(['/subscription-package']);
  }
  termsAndCondition() {
    window.location.href =
      'http://aviation.weathersa.co.za/#termsAndConditions';
  }
  POPIA() {
    window.location.href = 'http://www.weathersa.co.za/home/popia';
  }

  isLoginPage(): boolean {
    const currentRoute = this.router.url;
    return (
      currentRoute.includes('/login') ||
      currentRoute.includes('/register') ||
      currentRoute.includes('/forgot-password')
    );
  }
}
