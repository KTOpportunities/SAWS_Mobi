import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { Keyboard } from '@capacitor/keyboard';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { APIService } from 'src/app/services/apis.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit, OnDestroy {

  isKeyboardVisible = false;
  loading = false;
  submitted = false;

  errorMgs = '';
  successMsg = '';
  userEmail = ''; // ADD: to store email from forgot page

  userForm!: FormGroup;

  // Six separate boxes for the OTP
  tokenBoxes: string[] = ['', '', ''];

  private keyboardShowListener: any;
  private keyboardHideListener: any;

  constructor(
    private router: Router,
    private platform: Platform,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private api: APIService, // ADD
    private toastController: ToastController // ADD
  ) {

    this.userForm = this.fb.group(
      {
        Token: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6)
          ]
        ],
        NewPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8)
          ]
        ],
        ConfirmPassword: [
          '',
          [
            Validators.required
          ]
        ]
      },
      {
        validators: this.passwordMatchValidator
      }
    );

    // Keyboard listeners
    this.keyboardShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        this.isKeyboardVisible = true;
      }
    );

    this.keyboardHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        this.isKeyboardVisible = false;
      }
    );
  }

  ngOnInit(): void {
    this.platform.ready().then(() => {
      Keyboard.addListener('keyboardWillShow', () => { this.isKeyboardVisible = true; });
      Keyboard.addListener('keyboardWillHide', () => { this.isKeyboardVisible = false; });
    });

    // Get email from URL: /reset-password?email=test@test.com
    this.route.queryParams.subscribe(params => {
      this.userEmail = params['email'] || '';

      // Keep this for backwards compat if you still use token links
      const token = params['token'];
      if (token) {
        const tokenValue = token.toString().substring(0, 6);
        this.userForm.patchValue({ Token: tokenValue });
        this.tokenBoxes = tokenValue.split('').concat(['', '', '', '', '']).slice(0, 6);
      }
    });

    if(!this.userEmail){
      this.presentToast('top', 'Email not found. Please request OTP again', 'danger', 'close');
      this.router.navigate(['/forgot-password']);
    }
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, color: string, icon: string) {
    const toast = await this.toastController.create({
      message: message, duration: 4000, position, color, icon, cssClass:"custom-toast"
    });
    await toast.present();
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('NewPassword')?.value;
    const confirmPassword = control.get('ConfirmPassword')?.value;
    if (!password ||!confirmPassword) { return null; }
    return password === confirmPassword? null : { passwordMismatch: true };
  }

  onTokenInput(event: any, index: number): void {
    let value = event.target.value;
    value = value.replace(/[^0-9]/g, '');
    value = value.substring(0, 1);
    this.tokenBoxes[index] = value;
    event.target.value = value;
    this.updateToken();
    if (value && index < 5) {
      const nextInput = document.getElementById(`token-${index + 1}`) as HTMLInputElement;
      if (nextInput) { nextInput.focus(); }
    }
  }

  onTokenKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' &&!this.tokenBoxes[index] && index > 0) {
      const previousInput = document.getElementById(`token-${index - 1}`) as HTMLInputElement;
      if (previousInput) {
        previousInput.focus();
        this.tokenBoxes[index - 1] = '';
        previousInput.value = '';
        this.updateToken();
      }
    }
  }

  onTokenPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    const token = pastedText.replace(/[^0-9]/g, '').substring(0, 6);
    if (!token) { return; }
    this.tokenBoxes = ['', '', '', ''];
    token.split('').forEach((digit, index) => { this.tokenBoxes[index] = digit; });
    this.updateToken();
    const lastIndex = Math.min(token.length - 1, 5);
    const input = document.getElementById(`token-${lastIndex}`) as HTMLInputElement;
    if (input) { input.focus(); }
  }

  private updateToken(): void {
    const token = this.tokenBoxes.join('');
    this.userForm.patchValue({ Token: token }, { emitEvent: false });
  }

  // CHANGED: This now calls VerifyOTPAndResetPassword
  onSubmit(): void {
    this.errorMgs = '';
    this.successMsg = '';
    this.loading = true;
    this.submitted = true;

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.presentToast('top', 'Please fill all fields correctly', 'danger', 'close');
      this.loading = false;
      return;
    }

    const request = {
      email: this.userEmail,
      otp: this.userForm.value.Token,
      newPassword: this.userForm.value.NewPassword
    };

    this.api.VerifyOTPAndResetPassword(request).subscribe({
      next: (res: any) => {
        this.loading = false;
        if(res.success){
          this.presentToast('top', 'Password reset successfully', 'success', 'checkmark');
          setTimeout(() => this.router.navigate(['/login']), 1500);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMgs = error?.error?.errorMessage || 'Invalid OTP or password';
        this.presentToast('top', this.errorMgs, 'danger', 'close');
      }
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.keyboardShowListener) { this.keyboardShowListener.remove(); }
    if (this.keyboardHideListener) { this.keyboardHideListener.remove(); }
  }
}