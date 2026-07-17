import {
  Component,
  OnInit,
  OnDestroy,
  Renderer2,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastController } from '@ionic/angular';
import { APIService } from 'src/app/services/apis.service';
import { Keyboard } from '@capacitor/keyboard';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  @ViewChild('userFormRef') userFormRef!: ElementRef;
  private mobileQuery: MediaQueryList;
  isMobile: boolean;
  notLogged = false;
  isLogged = false;
  submitted = false;
  userData: any = null;
  showPassword: boolean = false;
  errorMessage: string | null = null;
  loading = false;
  isKeyboardVisible = false;

  loginForm: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mediaMatcher: MediaMatcher,
    private authAPI: AuthService,
    private apiService: APIService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private renderer: Renderer2,
    private toastController: ToastController,
    private platform: Platform
  ) {
    this.mobileQuery = this.mediaMatcher.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => (this.isMobile = this.mobileQuery.matches);
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
    this.isMobile = this.mobileQuery.matches;

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    // Keyboard listeners
    Keyboard.addListener('keyboardWillShow', () => this.isKeyboardVisible = true);
    Keyboard.addListener('keyboardWillHide', () => this.isKeyboardVisible = false);
  }

  ngOnInit() {
    // Pre-fill saved credentials if Remember Me was checked
    const remember = localStorage.getItem('rememberMe');
    if (remember === 'true') {
      this.loginForm.patchValue({
        username: localStorage.getItem('savedUsername') || '',
        password: localStorage.getItem('savedPassword') || '',
        rememberMe: true
      });
    }

    this.route.queryParams.subscribe((params) => {
      const subscriptionPackageId = params['id'];
      if (subscriptionPackageId) {
        this.loginForm.patchValue({ subscriptionPackageId });
      }
    });

    this.platform.ready().then(() => {
      Keyboard.addListener('keyboardWillShow', () => this.isKeyboardVisible = true);
      Keyboard.addListener('keyboardWillHide', () => this.isKeyboardVisible = false);
    });
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
    Keyboard.removeAllListeners();
  }

  private mobileQueryListener: () => void;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  isLoginPage() {
    return this.router.url === '/login';
  }

  register() {
    this.router.navigate(['/register']);
  }

  forgortPassword() {
    this.router.navigate(['/forgot-password']);
  }

  home() {
    this.router.navigate(['/landing-page']);
    this.authAPI.setIsFromSubscription(false);
    this.authAPI.setSubscriptionStatus('');
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = null;

    if (this.loginForm.valid) {
      this.loading = true;
      this.spinner.show();

      this.authAPI.login(this.loginForm.value).subscribe(
        (response) => {
          this.userData = response;
          this.authAPI.setLoggedInStatus(true);
          this.authAPI.setUserData(this.userData);
          this.authAPI.saveCurrentUser(response);
          this.UpdateSubscription(response.userProfileId);

          // Handle Remember Me
          if (this.loginForm.value.rememberMe) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('savedUsername', this.loginForm.value.username);
            localStorage.setItem('savedPassword', this.loginForm.value.password);
          } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('savedUsername');
            localStorage.removeItem('savedPassword');
          }

          this.presentToast('top', 'Login Successful!', 'success', 'checkmark');
          this.router.navigate(['/landing-page']);
        },
        (error) => {
          this.presentToast(
            'top',
            error.error?.errorMessages || 'Server application error!',
            'danger',
            'close'
          );
          this.notLogged = true;
          this.loading = false;
        }
      ).add(() => {
        this.loading = false;
        this.spinner.hide();
      });
    }
  }

 UpdateSubscription(userId: number) {
  this.loading = true;
  this.apiService.GetActiveSubscriptionByUserProfileId(userId).subscribe({
    next: (res) => {
      console.log('Subscription:', res);
      this.authAPI.setSubscriptionStatus(res?.subscriptionType || '');
      this.loading = false;
    },
    error: (err) => {
      console.error('Failed to get subscription', err);
      this.loading = false;
    }
  });
}

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, color: string, icon: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position,
      color,
      icon,
      cssClass: 'custom-toast',
      swipeGesture: 'vertical',
      buttons: [{ icon: 'close', htmlAttributes: { 'aria-label': 'close' } }],
    });
    await toast.present();
  }

  async presentToastSub(position: 'top' | 'middle' | 'bottom', message: string, color: string, icon: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position,
      color,
      icon,
      cssClass: 'custom-toast',
      swipeGesture: 'vertical',
      buttons: [
        {
          side: 'end',
          text: 'Go to Subscription',
          handler: () => this.router.navigate(['/subscription-package']),
        },
      ],
    });
    await toast.present();
  }

 onRememberMeChange(event: any) {
  
  if (event.target.checked) {
    // Show confirmation toast
     if (this.loginForm.invalid) {
      // 🚨 Prevent saving empty details
      this.presentToast('top', 'Please enter your username and password before using Remember Me', 'danger', 'alert-circle');
      this.loginForm.patchValue({ rememberMe: false }); // uncheck it
      return;
    }
    this.presentRememberMeToast();
  } else {
    // If unchecked, clear any stored credentials
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('savedUsername');
    localStorage.removeItem('savedPassword');
  }
}

async presentRememberMeToast() {
  const toast = await this.toastController.create({
    message: 'Do you want to remember your password?',
    position: 'top',
    color: 'primary', 
    icon: 'lock-closed', 
    cssClass: 'custom-toast',
    swipeGesture: 'vertical',
    buttons: [
      {
        side: 'start',
        text: 'Yes',
        handler: () => {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('savedUsername', this.loginForm.value.username);
          localStorage.setItem('savedPassword', this.loginForm.value.password);
        },
      },
      {
        text: 'No',
        role: 'cancel',
        handler: () => {
          this.loginForm.patchValue({ rememberMe: false });
        },
      },
      {
        icon: 'close',
        side: 'end',
        htmlAttributes: { 'aria-label': 'close' },
      },
    ],
  });

  await toast.present();
}


}
