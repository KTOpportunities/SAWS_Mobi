import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  private mobileQuery: MediaQueryList;
  isMobile: boolean;
  notLogged = false;
  username: string | null = null;
  password: string | null = null;
  userData: any = null;

  errorMessage: string | null = null;
  successMessage: string | null = null;
  loading = false;
  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  constructor(
    private router: Router,
    private mediaMatcher: MediaMatcher,
    private authAPI: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.mobileQuery = this.mediaMatcher.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => (this.isMobile = this.mobileQuery.matches);
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
    this.isMobile = this.mobileQuery.matches;
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }

  private mobileQueryListener: () => void;

  isLoginPage() {
    // Check if the current route is the login page
    return this.router.url === '/login';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Set loading to true to show loading indicator
      this.loading = true;
      this.spinner.show();
      // Call the login method from AuthService
      this.authAPI
        .login(this.loginForm.value)
        .subscribe(
          (response) => {
            console.log('RESPONSE:', response);

            this.showSuccessAlert();

            this.router.navigate(['/folder/inbox']);
          },
          (error) => {
            // Handle login error

            this.notLogged = true;
            this.errorMessage = 'Invalid username or password';
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
  showSuccessAlert() {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'You added new user successfully.',
    });
  }

  showUnsuccessfulAlert() {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'Something went wrong. Please try again.',
    });
  }
}
