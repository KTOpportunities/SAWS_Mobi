import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { Feedback } from '../Models/message.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
interface Message {
  feedback?: string;
  response?: string;
  broadcast?: string;
  // Add other properties if needed
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  feedback: any;

  feedbackForm: FormGroup;

  fdMessages: any;

  username: any;
  Id: any;
  response: any;
  feedb: any;

  userEmail: any;
  userId: any;
  isBroadcastMessage: boolean = false;

  @ViewChild('scroll') scroll: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private APIService: APIService,
    private formBuilder: FormBuilder,
    private authS: AuthService,
    private alertController: AlertController,
    private cdr: ChangeDetectorRef
  ) {
    this.feedbackForm = this.formBuilder.group({
      feedbackId: [],
      title: [],
      fullname: [],
      senderId: [],
      senderEmail: [],
      responderId: [],
      responderEmail: [],
      created_at: [],
      updated_at: [],
      isdeleted: [],
      deleted_at: [],
      isresponded: [],
      responseMessage: ['', Validators.required],
      FeedbackMessages: [[]],
    });
  }

  ngOnInit() {
    this.getFeedback();

    var user: any = this.authS.getCurrentUser();

    if (user) {
      const userLoginDetails = JSON.parse(user);
      this.userEmail = userLoginDetails.userEmail;
      this.userId = userLoginDetails.userID;
    }
  }

  getFeedback() {
    this.Id = this.route.snapshot.paramMap.get('Id');
    this.username = this.route.snapshot.paramMap.get('usname');

    console.log('id: ', this.Id);
    console.log('id: ', this.username);

    this.APIService.getFeedbackById(this.Id).subscribe((fback: Feedback) => {
      this.feedback = fback;
      this.fdMessages = fback.FeedbackMessages;
      console.log('feedback: ', this.feedback);
      this.feedbackForm.patchValue(fback);
      this.cdr.detectChanges();
    });
  }

  onSubmit() {
    const formValues = this.feedbackForm.value;

    const body = {
      feedbackId: formValues.feedbackId,
      fullname: formValues.fullname,
      senderId: formValues.senderId,
      senderEmail: formValues.senderEmail,
      responderId: this.userId,
      responderEmail: this.userEmail,
      created_at: formValues.created_at,
      title: formValues.title,
      isresponded: true,
      FeedbackMessages: [
        {
          senderId: formValues.senderId,
          senderEmail: formValues.senderEmail,
          responderId: this.userId,
          responderEmail: this.userEmail,
          feedback: formValues.responseMessage,
          response: '',
        },
      ],
    };

    this.updateFeedbackForm(body);
  }

  updateFeedbackForm(body: any) {
    this.APIService.postInsertNewFeedback(body).subscribe((data: any) => {
      this.feedbackForm.reset();
      this.getFeedback();
    });
  }

  home() {
    // Check if the current route is the login page
    this.router.navigate(['/landing-page']);
  }
  BacktoMessagelist() {
    this.router.navigate(['/message-list']);
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
  checkBroadcast() {
    // Check if any message has broadcast and it's not a feedback
    this.isBroadcastMessage = this.fdMessages.some((message: any) => {
      return (
        message.broadcast !== null &&
        message.broadcast !== undefined &&
        !message.feedback
      );
    });
  }
  shouldShowChatRow(): boolean {
    return (
      this.fdMessages &&
      this.fdMessages.length > 0 &&
      this.fdMessages.some((message: any) => message.broadcast === null)
    );
  }

  
}
