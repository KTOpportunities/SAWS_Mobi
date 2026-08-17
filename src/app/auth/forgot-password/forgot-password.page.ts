import {
  Component,
  HostListener,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { APIService } from 'src/app/services/apis.service';
import { Keyboard } from '@capacitor/keyboard';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  userForm: FormGroup;
  submitted = false;
  errorMgs: string | null = null;
  successMessage: string | null = null;
  loading = false;
  statusMessage = false;
  errorMessage = false;

  isKeyboardVisible = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    // Adjust your layout here based on the window size
  }
  @ViewChild('content') content!: ElementRef;

  scrollContent(): void {
    this.content.nativeElement.scrollIntoView();
  }

  emailValidator(control: any) {
    if (control.value) {
      const matches = control.value.match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      );
      return matches ? null : { invalidEmail: true };
    } else {
      return null;
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private api: APIService,
    private router: Router,
    private alertController: AlertController,
    private platform: Platform,
    private toastController: ToastController
  ) {
    this.userForm = this.formBuilder.group({
      Email: ['', [Validators.required, this.emailValidator]],
    });

    Keyboard.addListener('keyboardWillShow', () => {
      this.isKeyboardVisible = true;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      this.isKeyboardVisible = false;
    });
  }

  ngOnInit(): void {
    this.platform.ready().then(() => {
      Keyboard.addListener('keyboardWillShow', () => {
        this.isKeyboardVisible = true;
      });
      Keyboard.addListener('keyboardWillHide', () => {
        this.isKeyboardVisible = false;
      });
    });
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, color: string, icon: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: position,
      color: color,
      icon: icon,
      cssClass:"custom-toast",
      swipeGesture: "vertical",
      buttons: [
        {
          icon: 'close',
          htmlAttributes: { 'aria-label': 'close' },
        },
      ],
    });
    await toast.present();
  }

  onSubmit() {
    this.loading = true;
    this.submitted = true;

    const emailValue = this.userForm.controls['Email'].value;

    const body = {
      email: emailValue, // lowercase to match backend DTO
    };

    if (this.userForm.invalid) {
      this.presentToast('top', 'Please enter a valid email', 'danger', 'close');
      this.loading = false;
      return;
    }

    // CHANGED: Call new OTP API
    this.api.RequestPasswordResetOTP(body).subscribe(
      (data: any) => {
        this.loading = false;

        if(data.success){
          // FOR TESTING: Remove this in production
          if(data.data?.otp){
            console.log('OTP for testing:', data.data.otp);
            this.presentToast('top', `OTP: ${data.data.otp}`, 'warning', 'key');
          } else {
            this.presentToast('top', 'OTP sent! Please check your email', 'success', 'mail');
          }

          this.onReset();

          // Redirect to Reset Password page and pass email
          setTimeout(() => {
            this.router.navigate(['/reset-password'], { queryParams: { email: emailValue } });
          }, 1000);
        }
      },
      (error) => {
        this.loading = false;
        const errMsg = error.error?.errorMessage || 'Something went wrong';
        this.presentToast('top', errMsg, 'danger', 'close');
      }
    );
  }

  login() {
    this.router.navigate(['/login']);
  }

  onReset() {
    this.submitted = false;
    this.userForm.reset();
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}