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
  isSubscribed: boolean = false;
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
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private authAPI: AuthService
  ) {}
  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  ngOnInit() {
    this.fetchUserData();
  }

  fetchUserData() {
    this.userDetails = this.authService.getUserData();
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
  messagelist() {
    this.router.navigate(['/message-list']);
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

 
  displayIcon(): boolean {
    const currentRoute = this.router.url;
    return currentRoute.includes('/subscription-package');
  }
  // BacktoLadingpage(){
  //   debugger;
  //   this.router.navigate(['/landing-page']);
    
  // }
  
}
