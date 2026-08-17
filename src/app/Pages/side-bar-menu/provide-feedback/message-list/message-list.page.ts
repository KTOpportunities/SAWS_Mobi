import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLoggedIn } from 'src/app/Models/User.model';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.page.html',
  // styleUrls: ['../../subscription-package/subscription-package.page.scss'],
  styleUrls: ['./..//provide-feedback.page.scss'],
})
export class MessageListPage implements OnInit {
  isLogged: boolean = false;
  isLoading: boolean = true;
  userData: any;
  userLoginDetails: UserLoggedIn[] = [];
  feedbackMessages: any[] = [];
  aspUserName: any;
  aspUserEmail: any;
  aspUserID: any;
  isresponded: any;
  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private APIService: APIService
  ) {}

  ngOnInit() {
    // Check if user is logged in


    var user: any = this.authService.getCurrentUser();
    console.log('userData in ProvideFeedbackPage:', this.userData);
    const userLoginDetails = JSON.parse(user);
    this.aspUserName = userLoginDetails?.aspUserName;
    this.aspUserID = userLoginDetails?.aspUserId;
    this.aspUserEmail = userLoginDetails?.aspUserEmail;
    console.log('userData in ProvideFeedbackPage:', this.aspUserName);
    if (!this.authService.getIsLoggedIn()) {
      // If not logged in, navigate to the login page
      this.router.navigate(['/login']);
    }

    this.feedbacks();
  }

  feedbacks() {


    this.APIService.getFeedbackMessagesBySenderId(this.aspUserID).subscribe(
      (response) => {        
        this.feedbackMessages = response;

        this.isLoading = false;

      },
      (error) => {
        console.error('Error fetching feedback messages:', error);

        this.isLoading = false;
      }
    );
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
  
  providerfeedback() {
    this.router.navigate(['/provide-feedback']);
  }

  home() {
    this.router.navigate(['/landing-page']);
  }

  navigateToChat(id: string, username: string) {
    this.router.navigate(['/chat', { Id: id, usname: username }]); // Navigate to the 'chat' route
  }
}
