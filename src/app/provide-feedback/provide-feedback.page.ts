import { Component, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserLoggedIn } from '../Models/User.model';
import { FormBuilder, Validators } from '@angular/forms';
import { APIService } from '../services/apis.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-provide-feedback',
  templateUrl: './provide-feedback.page.html',
  styleUrls: ['./provide-feedback.page.scss'],
})
export class ProvideFeedbackPage implements OnInit {
  userData: any;
  userLoginDetails: UserLoggedIn[] = [];
  aspUserName: any;
  aspUserEmail: any;
  aspUserID: any;
  fullname: any;

  userForm: any;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private api: APIService,
    private router: Router,
    private alertController: AlertController
  ) {
    this.userForm = this.formBuilder.group({
      Username: [this.aspUserName, Validators.required],
      message: ['', Validators.required],
      title: ['', Validators.required],
    });
  }

  ngOnInit() {
    debugger;
    var user: any = this.authService.getCurrentUser();
    console.log('userData in ProvideFeedbackPage:', this.userData);
    console.log('user:', user);
    const userLoginDetails = JSON.parse(user);
    this.aspUserName = userLoginDetails?.aspUserName;
    this.aspUserID = userLoginDetails?.aspUserID;
    this.aspUserEmail = userLoginDetails?.aspUserEmail;
    this.fullname = userLoginDetails?.fullname;
    console.log('userData in ProvideFeedbackPage:', this.aspUserName);

    this.userForm = this.formBuilder.group({
      Username: [this.aspUserName, Validators.required],
      title: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  onSubmitFeedback() {
    // Populate feedback data
    let user = JSON.parse(sessionStorage.getItem('CurrentUser')!);
    const feedbackData = {
      feedbackId: 0,
      fullname: user.fullname,
      senderId: this.aspUserID, // You need to populate this based on your application logic
      senderEmail: this.aspUserEmail,
      responderId: '',
      responderEmail: '',
      title: this.userForm.value.title,
      isresponded: false,

      FeedbackMessages: [
        {
          senderId: this.aspUserID,
          senderEmail: this.aspUserEmail,
          responderId: '',
          responderEmail: '',
          feedback: this.userForm.value.message,
          response: '',
        },
      ],
    };
    debugger;
    console.log('BODY:', feedbackData);
    // Call API to send feedback data
    this.api.PostInsertNewFeedback(feedbackData).subscribe(
      (response) => {
        // Handle success response
        console.log('Feedback submitted successfully:', response);
        this.presentSuccessAlert();
        this.router.navigate(['/message-list']); // Navigate to a success page
      },
      (error) => {
        // Handle error response
        console.error('Error submitting feedback:', error);
        // You can show an error alert to the user
        this.presentErrorAlert();
      }
    );
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
