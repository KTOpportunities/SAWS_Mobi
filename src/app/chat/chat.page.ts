import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { Feedback } from '../Models/message.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

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

  @ViewChild('scroll') scroll: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private APIService: APIService,
    private formBuilder: FormBuilder,
    private authS: AuthService
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
      isresponded: false,
      FeedbackMessages: [
        {
          senderId: formValues.senderId,
          senderEmail: formValues.senderEmail,
          responderId: this.userId,
          responderEmail: this.userEmail,
          feedback: '',
          response: formValues.responseMessage,
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
}
