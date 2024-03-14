import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-observation',
  templateUrl: './observation.page.html',
  styleUrls: ['./observation.page.scss'],
})
export class ObservationPage implements OnInit {
  isLogged: boolean = false;
  webcamActive: boolean = false;
  constructor(private router: Router, private authService: AuthService) {}
  ngOnInit() {}
  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  observPage() {
    this.router.navigate(['/landing-page']);
  }
  observMetarPage() {
    this.webcamActive = true; // Verify if this assignment is executed
    console.log('webcamActive set to true:', this.webcamActive);
  }
}
