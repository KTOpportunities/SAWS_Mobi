import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.page.html',
  styleUrls: ['./landing-page.page.scss'],
})
export class LandingPagePage implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {}
  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
  forecastPage() {
    this.router.navigate(['/forecast']);
  }
  InternationalPage() {
    this.router.navigate(['/international']);
  }
  FlightBriefing() {
    if (this.authService.getIsLoggedIn()) {
      this.router.navigate(['/flight-briefing']);
    } else {
      this.router.navigate(['/login']);
    }
  }
  // if (!this.authService.getIsLoggedIn()) {
  //   // If not logged in, navigate to the login page
  //   this.router.navigate(['/login']);
  // }
  aerosportPage() {
   if (this.authService.getIsLoggedIn()){
    this.router.navigate(['/aero-sport']);
   }
   else {
    this.router.navigate(['/login']);
  }
  }

  domesticPage() {
    if (this.authService.getIsLoggedIn()) {
       this.router.navigate(['/domestic']);
    }else {
      this.router.navigate(['/login']);
    }
    
  }
  observPage() {
    this.router.navigate(['/observation']);
  }
}
