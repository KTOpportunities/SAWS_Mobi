import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { fileDataFeedback } from 'src/app/Models/File';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { AttachmentFilePage } from '../chat/attachment-file/attachment-file.page';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from 'src/app/services/apis.service';
import { Keyboard } from '@capacitor/keyboard';
import { MediaMatcher } from '@angular/cdk/layout';

interface Message {
  feedback?: string;
  response?: string;
  broadcast?: string;
  // Add other properties if needed
}

@Component({
  selector: 'app-provide-feedback',
  templateUrl: './provide-feedback.page.html',
  styleUrls: ['./provide-feedback.page.scss'],
})
export class ProvideFeedbackPage implements OnInit {
  feedback: any;
  feedbackForm: FormGroup;
  fdMessages: any;
  submitted = false;
  username: any;
  Id: any;
  response: any;
  feedb: any;

  userEmail: any;
  userId: any;
  fullname: any;
  isBroadcastMessage: boolean = false;
  files: fileDataFeedback[] = [];

  selectedFile: File | undefined;
  selectedFileName: any;
  selectedFileSrc: string | ArrayBuffer | null = null;
  selectedFileType: string | undefined;
  responseData: any;
  fileFeedback: any = {};
  addFile: boolean = false;
  feedbackData: any;
  private mobileQuery: MediaQueryList;
  isMobile: boolean;
  isKeyboardVisible = false;
  @ViewChild('scroll') scroll: any;
  @ViewChild('myFileInput') myFileInputVariable!: ElementRef;
  @ViewChild('content') content!: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private APIService: APIService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private toastController: ToastController,
    private mediaMatcher: MediaMatcher,
    private platform: Platform
  ) {
    this.feedbackForm = this.formBuilder.group({
      title: ['', Validators.required],
      message: ['', Validators.required],
      feedbackFile: [null], // This will hold the file object
    });

    this.mobileQuery = this.mediaMatcher.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => (this.isMobile = this.mobileQuery.matches);
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
    this.isMobile = this.mobileQuery.matches;

    Keyboard.addListener('keyboardWillShow', () => {
      this.isKeyboardVisible = true;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      this.isKeyboardVisible = false;
    });
  }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      const userLoginDetails = JSON.parse(user);
      this.userEmail = userLoginDetails.aspUserEmail;
      this.userId = userLoginDetails.aspUserId;
      this.fullname = userLoginDetails.fullname;
    }

    this.platform.ready().then(() => {
      // Listen for keyboard will show event
      Keyboard.addListener('keyboardWillShow', () => {
        this.isKeyboardVisible = true;
      });

      // Listen for keyboard will hide event
      Keyboard.addListener('keyboardWillHide', () => {
        this.isKeyboardVisible = false;
      });
    });
  }
  private mobileQueryListener: () => void;
  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);

    Keyboard.removeAllListeners();
  }
  getFeedback() {
    // this.Id = this.route.snapshot.paramMap.get('Id');
    // this.username = this.route.snapshot.paramMap.get('usname');

    console.log('id: ', this.Id);
    console.log('id: ', this.username);
  }
  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onSubmit() {
    this.submitted = true;

    if (this.feedbackForm.valid) {
    
      const formValues = this.feedbackForm.value;

      let body = {
        fullname: this.fullname,
        senderId: this.userId,
        senderEmail: this.userEmail,
        responderId: '',
        responderEmail: '',
        title: formValues.title,
        isresponded: false,
        feedbackMessages: [
          {
            senderId: this.userId,
            senderEmail: this.userEmail,
            responderId: '',
            responderEmail: '',
            feedback: formValues.message,
            response: '',
            broadcast: null,
            broadcastId: null,
            feedbackAttachment: '',
            feedbackAttachmentFileName: '',
            responseAttachment: '',
            responseAttachmentFileName: '',
          },
        ],
      };

      if (this.addFile == true) {
        body = {
          fullname: this.fullname,
          senderId: this.userId,
          senderEmail: this.userEmail,
          responderId: '',
          responderEmail: '',
          title: formValues.title,
          isresponded: false,
          feedbackMessages: [
            {
              senderId: this.userId,
              senderEmail: this.userEmail,
              responderId: '',
              responderEmail: '',
              feedback: '',
              response: '',
              broadcast: null,
              broadcastId: null,
              feedbackAttachment: formValues.message,
              feedbackAttachmentFileName: this.selectedFileName,
              responseAttachment: '',
              responseAttachmentFileName: '',
            },
          ],
        };
      }

      this.APIService.postInsertNewFeedback(body).subscribe(
        (data: any) => {
          const feedbackId = data.detailDescription.feedbackId;
          if(this.addFile == true){
            this.uploadFile(
              data.detailDescription.feedbackMessages[0].feedbackMessageId
            );
          }
          
          this.feedbackForm.reset();
          this.responseData = data.detailDescription;
          // console.log('this.responseData', this.responseData);

          this.selectedFile = undefined;
          this.selectedFileSrc = null;
          this.selectedFileType = undefined;
          this.addFile = false;

          this.presentToast('top','Feedback Successfully Sent!','success','checkmark');

          this.router.navigate(['/message-list']);
          // this.feedbackForm.reset();
          // if (this.fileFeedback.file) {
          //   // Check if file is selected
          //   this.feedbackForm.reset();
          //   this.openAttachmentDialog(data.detailDescription, '500ms', '500ms');
          // } else {
          //   this.feedbackForm.reset();
          //   alert('Successfully Created');
          // }
        },
        (error) => {
          console.error('Error submitting feedback:', error);
          this.presentErrorAlert();
        }
      );
    } else {
      this.presentToast('top', 'Form is invalid!', 'danger', 'close');
    }
  }

  onSubmitAttachment() {
    if (this.selectedFile) {
      const formValues = this.feedbackForm.value;

      const body = {
        feedbackId: this.responseData.feedbackId,
        fullname: this.fullname,
        senderId: this.userId,
        senderEmail: this.userEmail,
        responderId: '',
        responderEmail: '',
        created_at: this.responseData.created_at,
        title: this.responseData.title,
        isresponded: false,
        FeedbackMessages: [
          {
            senderId: this.responseData.senderId,
            senderEmail: this.responseData.senderEmail,
            responderId: '',
            responderEmail: '',
            feedback: '',
            response: '',
            feedbackAttachment: this.responseData.responseMessage,
            feedbackAttachmentFileName: this.selectedFileName,
            responseAttachment: '',
            responseAttachmentFileName: this.selectedFileName,
          },
        ],
      };
      this.updateFeedbackFormWithAttachment(body);
      this.presentSuccessAlert();

      this.getFeedback();
    } else {
      return;
    }
  }

  async uploadFile(feedbackId: number) {
  
    if (this.files.length > 0) {
      this.files[0].Id = 0;
      this.files[0].feedbackMessageId = feedbackId;

      const formData = new FormData();

      for (let i = 0; i < this.files.length; i++) {
        formData.append(`files[${i}].id`, JSON.stringify(this.files[i].Id));
        formData.append(
          `files[${i}].feedbackMessageId`,
          JSON.stringify(this.files[i].feedbackMessageId)
        );
        formData.append(`files[${i}].DocTypeName`, this.files[i].DocTypeName);
        formData.append(`files[${i}].file`, this.files[i].file);
      }

      try {
        await this.APIService.PostDocsForFeedback(formData).toPromise();
      } catch (error) {
        console.error('Error uploading files:', error);
        throw error;
      }
    }
  }

  updateFeedbackForm(body: any) {
    this.APIService.postInsertNewFeedback(body).subscribe(
      (data: any) => {
        this.feedbackForm.reset();

        this.getFeedback();
      },
      (err) => {
        console.log('Error:', err);
        alert('Unsuccessful');
      }
    );
  }

  updateFeedbackFormWithAttachment(body: any) {
    this.APIService.postInsertNewFeedback(body).subscribe(
      (data: any) => {
        this.feedbackForm.reset();
      
        this.uploadFile(
          data.detailDescription.feedbackMessages[0].feedbackMessageId
        );
        this.getFeedback();
      },
      (err: any) => {
        console.log('Error:', err);
        alert('Unsuccessful');
      }
    );
  }

  resetFilesInp() {
    this.myFileInputVariable.nativeElement.value = '';
  }

  async presentToast(
    position: 'top' | 'middle' | 'bottom',
    message: string,
    color: string,
    icon: string
  ) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: position,
      color: color,
      icon: icon,
      cssClass: 'custom-toast',
      swipeGesture: 'vertical',
      buttons: [
        {
          icon: 'close',
          htmlAttributes: {
            'aria-label': 'close',
          },
        },
      ],
    });

    await toast.present();
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

  updateFileData(
    fileDataToUpdate: fileDataFeedback,
    newFile: File,
    docTypeName: string
  ) {
    if (newFile) {
      fileDataToUpdate.file = newFile;
      fileDataToUpdate.DocTypeName = docTypeName;

      const index = this.files.findIndex(
        (file) => file.DocTypeName === docTypeName
      );

      if (index !== -1) {
        this.files[index] = fileDataToUpdate;
      } else {
        this.files.push(fileDataToUpdate);
      }
    }
  }

  onFileSelected(event: any) {
 
    const file = event.target.files[0];

    this.selectedFile = file;
    this.selectedFileName = file.name;
    this.selectedFileType = file.type;

    if (file.size <= 26214400) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFileSrc = reader.result;
        this.addFile = true;
        this.feedback = file;
        console.log('DATA CHECK::', this.feedback);
        console.log('DATA CHECK:: 2', this.responseData);
        this.openAttachmentDialogSelected(this.feedback, '800ms', '500ms');
      };

      reader.onerror = (error) => {
        console.error('File reading error:', error);
      };
      reader.readAsDataURL(file);

      this.updateFileData(this.fileFeedback, event.target.files[0], 'Feedback');
    } else {
      alert('File exceeds 25mb,please upload a smaller size file');
      this.resetFilesInp();
    }

    event.target.value = null;
  }
  fileType: any = '';
  shouldScrollToBottom: boolean = true;
  openAttachmentDialog(
    element: any,
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    if (!element) {
      // If feedback data is not available, return or handle appropriately
      return;
    }

    this.fileType = this.APIService.getFileType(
      element.file_mimetype || this.selectedFileType
    );

    this.shouldScrollToBottom = false;

    const formValues = this.feedbackForm.value;

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(AttachmentFilePage, {
      data: {
        feedbackData: element,
        imageSRC: this.selectedFileSrc || element.file_url,
        message: formValues.responseMessage || '',
        responderEmail: this.userEmail,
        resonderId: this.userId,
        addFile: this.addFile,
        fileType: this.fileType,
      },
      enterAnimationDuration,
      exitAnimationDuration,
      width: '85%',
      height: '80%',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'submit') {
        // this.onSubmitAttachment();
        this.shouldScrollToBottom = true;
      }

      this.selectedFile = undefined;
      this.selectedFileSrc = null;
      this.selectedFileType = undefined;
      this.addFile = false;
      // this.feedbackForm.reset();
    });
  }

  openAttachmentDialogSelected(
    element: any,
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    // if (!element) {
    //   // If feedback data is not available, return or handle appropriately
    //   return;
    // }
   

    this.fileType = this.APIService.getFileType(
      element.file_mimetype || this.selectedFileType
    );

    this.shouldScrollToBottom = false;

    const formValues = this.feedbackForm.value;

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(AttachmentFilePage, {
      data: {
        feedbackData: element,
        imageSRC: this.selectedFileSrc || element.file_url,
        message: formValues.responseMessage || '',
        responderEmail: this.userEmail,
        resonderId: this.userId,
        addFile: this.addFile,
        fileType: this.fileType,
      },
      // enterAnimationDuration,
      // exitAnimationDuration,
      width: '85%',
      height: '80%',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'submit') {
        this.shouldScrollToBottom = true;
      }
    });
  }
}
