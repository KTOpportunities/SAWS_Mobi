import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./../flight-briefing.page.scss'],
})
export class ShareComponent  implements OnInit {

  isLogged: boolean = false;
  loading: boolean = false;
  usernameToShare: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: APIService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    if (!this.authService.getIsLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  NavigateToFlightBriefing() {
    this.router.navigate(['/flight-briefing']);
  }

  // Simple function - no API
  shareFlight() {
    this.errorMessage = '';
    
    if(!this.usernameToShare.trim()){
      this.errorMessage = 'Please enter a username';
      return;
    }

    // For now just always show this error
    this.errorMessage = 'The username you entered does not exist';
    this.usernameToShare = '';
  }
}