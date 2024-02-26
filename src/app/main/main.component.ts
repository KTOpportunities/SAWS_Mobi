import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
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
  // FlightBriefing() {
  //   if (this.authService.getIsLoggedIn()) {
  //     this.router.navigate(['/flight-briefing']);
  //   } else {
  //     this.router.navigate(['/login']);
  //   }
  // }
  // if (!this.authService.getIsLoggedIn()) {
  //   // If not logged in, navigate to the login page
  //   this.router.navigate(['/login']);
  // }
  aerosportPage() {
    if (this.authService.getIsLoggedIn()) {
      this.router.navigate(['/aero-sport']);
    } else {
      this.authService.setRedirectUrl('/aero-sport');
      this.router.navigate(['/login']);
    }
  }

  // domesticPage() {
  //   if (this.authService.getIsLoggedIn()) {
  //      this.router.navigate(['/domestic']);
  //   }else {
  //     this.router.navigate(['/login']);
  //   }

  // }
  observPage() {
    this.router.navigate(['/observation']);
  }

  FlightBriefing() {
    if (this.authService.getIsLoggedIn()) {
      this.router.navigate(['/flight-briefing']);
    } else {
      // Store the intended URL before redirecting to login
      this.authService.setRedirectUrl('/flight-briefing');
      this.router.navigate(['/login']);
    }
  }

  domesticPage() {
    if (this.authService.getIsLoggedIn()) {
      this.router.navigate(['/domestic']);
    } else {
      // Store the intended URL before redirecting to login
      this.authService.setRedirectUrl('/domestic');
      this.router.navigate(['/login']);
    }
  }
}
