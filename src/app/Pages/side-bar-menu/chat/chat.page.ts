import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { fileDataFeedback } from 'src/app/Models/File';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AttachmentFilePage } from './attachment-file/attachment-file.page';
import { AuthService } from 'src/app/services/auth.service';
import { Feedback } from 'src/app/Models/message.model';
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
  files: fileDataFeedback[] = [];

  selectedFile: File | undefined;
  selectedFileName: string | undefined;
  selectedFileSrc: string | ArrayBuffer | null = null;
  selectedFileType: string | undefined;

  fileFeedback: any = {};
  addFile: boolean = false;
  feedbackData: any;
  @ViewChild('scroll') scroll: any;
  @ViewChild('myFileInput') myFileInputVariable!: ElementRef;
  @ViewChild('content') content!: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private APIService: APIService,
    private formBuilder: FormBuilder,
    private authS: AuthService,
    private alertController: AlertController,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog
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
      feedbackFile: [''],
      responseMessage: ['', Validators.required],
      feedbackMessages: [[]],
    });
  }

  ngOnInit() {
    this.Id = this.route.snapshot.paramMap.get('Id');
    this.username = this.route.snapshot.paramMap.get('usname');
    this.getFeedback();

    var user: any = this.authS.getCurrentUser();

    if (user) {
      const userLoginDetails = JSON.parse(user);
      this.userEmail = userLoginDetails.userEmail;
      this.userId = userLoginDetails.userID;
    }
  }

  getFeedback() {
    // this.Id = this.route.snapshot.paramMap.get('Id');
    // this.username = this.route.snapshot.paramMap.get('usname');

    console.log('id: ', this.Id);
    console.log('id: ', this.username);

    this.APIService.getFeedbackById(this.Id).subscribe((fback: any) => {
      this.feedback = fback.detailDescription;
   
      this.fdMessages = fback.detailDescription.feedbackMessages;
      console.log('feedback: ', this.feedback);
      this.feedbackForm.patchValue(this.feedback);
      this.cdr.detectChanges();
    });
  }
  getSafeUrl(url: string,type: string): SafeResourceUrl {
    if(type.includes("application")){
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + url);
    }else{
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }
  onSubmit() {
    const formValues = this.feedbackForm.value;
 
    if (formValues != null) {
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
        feedbackMessages: [
          {
            senderId: formValues.senderId,
            senderEmail: formValues.senderEmail,
            responderId: this.userId,
            responderEmail: this.userEmail,
            feedback: formValues.responseMessage,
            response: '',
            feedbackAttachment: formValues.feedbackMessage,
            feedbackAttachmentFileName: this.selectedFileName,
            responseAttachment: '',
            responseAttachmentFileName: '',
          },
        ],
      };

      this.updateFeedbackForm(body);
      this.getFeedback();
    } else {
      alert('you cannot send empty message');
    }
  }
  onSubmitAttachment() {
    if (this.selectedFile) {
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
        feedbackMessages: [
          {
            senderId: formValues.senderId,
            senderEmail: formValues.senderEmail,
            responderId: this.userId,
            responderEmail: this.userEmail,
            feedback: '',
            response: '',
            feedbackAttachment: formValues.responseMessage,
            feedbackAttachmentFileName: this.selectedFileName,
            responseAttachment: '',
            responseAttachmentFileName: '',
          },
        ],
      };
      this.updateFeedbackFormWithAttachment(body);

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
        console.log('DATA CHECK::', this.feedback);
        this.openAttachmentDialog(this.feedback, '500ms', '500ms');
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
      height: '50%',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'submit') {
        this.onSubmitAttachment();
        this.shouldScrollToBottom = true;
      }

      this.selectedFile = undefined;
      this.selectedFileSrc = null;
      this.selectedFileType = undefined;
      this.addFile = false;
      this.feedbackForm.reset();
    });
  }
}
