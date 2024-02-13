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
  forecastPage() {
    this.router.navigate(['/forecast']);
  }

  aerosportPage () {
    this.router.navigate(['/aero-sport'])
  }
  
  domesticPage () {
    this.router.navigate(['/domestic'])
  }
  observPage() {
    this.router.navigate(['/observation'])
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
}
