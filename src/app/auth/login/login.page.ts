import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  private mobileQuery: MediaQueryList;
  isMobile: boolean;
  notLogged = false;
  isLogged = false;
  submitted = false;
  username: string | null = null;
  password: string | null = null;
  userData: any = null;
  showPassword: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  loading = false;
  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  constructor(
    private router: Router,
    private route:ActivatedRoute,
    private mediaMatcher: MediaMatcher,
    private authAPI: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private renderer: Renderer2
  ) {
    this.mobileQuery = this.mediaMatcher.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => (this.isMobile = this.mobileQuery.matches);
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
    this.isMobile = this.mobileQuery.matches;
  }
  ngOnInit() {
    // Retrieve subscriptionPackageId from query parameters
    this.route.queryParams.subscribe(params => {
      const subscriptionPackageId = params['id'];
      if (subscriptionPackageId) {
        // Set subscriptionPackageId in the login form or handle as needed
        this.loginForm.patchValue({
          subscriptionPackageId: subscriptionPackageId
        });
      }
    });
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword; // Toggle the visibility
    const passwordField = document.getElementById('field') as HTMLInputElement;
    passwordField.type = this.showPassword ? 'text' : 'password';
  }

  private mobileQueryListener: () => void;

  isLoginPage() {
    // Check if the current route is the login page
    return this.router.url === '/login';
  }
  register(){
    this.router.navigate(['/register']);
  }
  home() {
    // Check if the current route is the login page
    this.router.navigate(['/landing-page']);
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      // Set loading to true to show loading indicator
      this.loading = true;
      this.spinner.show();
      // Call the login method from AuthService
      this.authAPI
        .login(this.loginForm.value)
        .subscribe(
          (response) => {
            if (response.rolesList == 'Subscriber') {
              this.authAPI.setLoggedInStatus(true);
              this.userData = response;
              this.authAPI.setUserData(this.userData);
              this.authAPI.saveCurrentUser(response);  
              console.log('TEST::', this.userData);
              const redirectUrl = this.authAPI.getRedirectUrl();
          if (redirectUrl) {
            // If yes, navigate them to that URL
            this.router.navigateByUrl(redirectUrl);
          }else if(this.authAPI.getIsFromSubscription()) {
            // If not, navigate them to the landing page
            this.router.navigate(['/landing-page']);
          }
            } else {
              this.errorMessage = 'Only subscribers can login';
              this.router.navigate(['login']);
            }
          },
          (error) => {
            console.log(error);
            console.log('ERROR MESSAGE:', error.error.Message);
            if (
              error.error.Message == 'Please check your password and username'
            ) {
              this.errorMessage = 'Invalid username or password';
              this.router.navigate(['login']);
            }
            this.notLogged = true;

            this.loading = false;
          }
        )
        .add(() => {
          this.loading = false;

          // Hide the spinner
          this.spinner.hide();
        });
    }
  }
}
