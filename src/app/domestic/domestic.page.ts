import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-domestic',
  templateUrl: './domestic.page.html',
  styleUrls: ['./domestic.page.scss'],
})
export class DomesticPage implements OnInit {
isLogged: boolean = false;


  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
     // Check if user is logged in
     if (!this.authService.getIsLoggedIn()) {
      // If not logged in, navigate to the login page
      this.router.navigate(['/login']);
    }

  }
  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
  
  domesticPage() {
    this.router.navigate(['/landing-page']);
  }
}
