import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.page.html',
  styleUrls: ['../../subscription-package/subscription-package.page.scss'],
})
export class MessageListPage implements OnInit {
  isLogged: boolean = false;
 
  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

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
  providerfeedback() {    
    this.router.navigate(['/provide-feedback']);

  
  }

  home() {
    
    this.router.navigate(['../../landing-page']);
  }

}
