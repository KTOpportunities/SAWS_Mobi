import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { APIService } from 'src/app/services/apis.service';
import { UserLoggedIn } from '../Models/User.model';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

interface FeedbackMessage {
  feedbackMessageId: number;
  feedbackId: number;
  senderId: string;
  senderEmail: string;
  responderId: string;
  responderEmail: string;
  feedback: string;
  response: string;
  created_at: string;
  updated_at: string;
  isdeleted: boolean;
  deleted_at: string | null;
}

interface Feedback {
  feebackId: number;
  fullname: string;
  senderId: string;
  title: string;
  feedback: string;
  senderEmail: string;
  responderId: string;
  responderEmail: string;
  isresponded: boolean;
  created_at: string;
  updated_at: string;
  response: string;
  isdeleted: boolean;
  deleted_at: string | null;
  FeedbackMessages: FeedbackMessage[];
}
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  feedbackId: any;
  // feedbackMessages: any[] = [];
  feedbackMessages: Feedback[] = [];

  userData: any;
  userLoginDetails: UserLoggedIn[] = [];
  aspUserName: any;
  aspUserEmail: any;
  aspUserID: any;
  fullname: any;
  created_at: any;
  isresponded: any;
  title: any;

  userForm: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private APIService: APIService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController
  ) {
    this.userForm = this.formBuilder.group({
      message: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.feedbackId = params['feedbackId'];
      console.log('FEEDBACK ID:', this.feedbackId);
    });

    this.APIService.getFeedbackById(this.feedbackId).subscribe(
      (response) => {
        debugger;
        this.feedbackMessages = response.FeedbackMessages;
        this.created_at = response.created_at;
        this.isresponded = response.isresponded;
        this.title = response.title;
        console.log('MESSAGES:::', response); // Handle the response here
      },
      (error) => {
        console.error('Error fetching feedback messages:', error);
      }
    );
    var user: any = this.authService.getCurrentUser();
    console.log('userData in ProvideFeedbackPage:', this.userData);
    const userLoginDetails = JSON.parse(user);
    this.aspUserName = userLoginDetails?.aspUserName;
    this.aspUserID = userLoginDetails?.aspUserID;
    this.aspUserEmail = userLoginDetails?.aspUserEmail;
    this.fullname = userLoginDetails?.fullname;
  }
  onSubmitFeedback() {
    // Populate feedback data
    const feedbackData = {
      feebackId: parseInt(this.feedbackId, 10),
      fullname: this.fullname,
      senderId: this.aspUserID,
      senderEmail: this.aspUserEmail,
      responderId: '',
      responderEmail: '',
      isresponded: this.isresponded,
      created_at: this.created_at,
      title: this.title,
      FeedbackMessages: [
        {
          senderId: this.aspUserID,
          senderEmail: this.aspUserEmail,
          responderId: '',
          responderEmail: '',
          feedback: this.userForm.message,
          response: '',
        },
      ],
    };
    console.log('BODY:', feedbackData);
    // Call API to send feedback data
    this.APIService.PostInsertNewFeedback(feedbackData).subscribe(
      (response) => {
        // Handle success response
        console.log('Feedback submitted successfully:', response);
        this.presentSuccessAlert();
        this.router.navigate(['chat']); // Navigate to a success page
      },
      (error) => {
        // Handle error response
        console.error('Error submitting feedback:', error);
        // You can show an error alert to the user
        this.presentErrorAlert();
      }
    );
  }
  home() {
    // Check if the current route is the login page
    this.router.navigate(['/landing-page']);
  }
  async presentErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Failed to submit feedback. Please try again later.',
      buttons: ['OK'],
    });

    await alert.present();
  }
  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Feedback Successfully Sent.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
