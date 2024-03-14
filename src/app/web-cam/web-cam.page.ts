import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-web-cam',
  templateUrl: './web-cam.page.html',
  styleUrls: ['./web-cam.page.scss'],
})
export class WebCamPage implements OnInit {
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

}
