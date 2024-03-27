import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-flight-briefing',
  templateUrl: './flight-briefing.page.html',
  styleUrls: ['./flight-briefing.page.scss'],
})
export class FlightBriefingPage implements OnInit {
  isLogged: boolean = false;
  isFlight: boolean = true;
  isexportImport: boolean = false;
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {}
  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  importExport() {
    this.isFlight = false;
    this.isexportImport = true;
  }

  forecastPage() {
    this.router.navigate(['/landing-page']);
  }
}
