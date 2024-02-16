import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-international',
  templateUrl: './international.page.html',
  styleUrls: ['./international.page.scss'],
})
export class InternationalPage implements OnInit {
  isLogged: boolean = false;
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {}
  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
  forecastPage() {
    this.router.navigate(['/landing-page']);
  }
}
