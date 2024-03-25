import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-observation-metar-history',
  templateUrl: './observation-metar-history.page.html',
  styleUrls: ['./observation-metar-history.page.scss'],
})
export class ObservationMetarHistoryPage implements OnInit {

 



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
    // this.router.navigate(['/news']);
    this.router.navigate(['observation/observation-metar-history']);
  }
}
