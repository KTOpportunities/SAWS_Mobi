import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  currentStep: number = 1;
  userForm: FormGroup;
  submitted = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  loading = false;
  statusMessage = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    // Adjust your layout here based on the window size
  }
  @ViewChild('content') content!: ElementRef;

  // Call this method when the keyboard is opened
  scrollContent(): void {
    this.content.nativeElement.scrollIntoView();
  }
  constructor(
    private formBuilder: FormBuilder,
    private api: APIService,
    private router: Router
  ) {
    this.userForm = this.formBuilder.group({
      Fullname: ['', Validators.required],
      Username: ['', Validators.required],
      Email: ['', [Validators.required, this.emailValidator]],

      Password: ['', [Validators.required]],
      UserRole: ['Subscriber', [Validators.required]],
    });
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
  onSubmit() {
    this.submitted = true;

    debugger;
    var body = {
      Fullname: this.userForm.controls['Fullname'].value,
      Username: this.userForm.controls['Username'].value,
      Email: this.userForm.controls['Email'].value,
      Password: this.userForm.controls['Password'].value,
      UserRole: this.userForm.controls['UserRole'].value,
    };
    debugger;
    console.log('BODY:', body);
    if (this.userForm.invalid) {
      debugger;
      return;
    } else {
      this.api.createNewUser(body).subscribe((data: any) => {
        debugger;
        console.log('SAVED:', data);
        // this.nextStep();
        if (data.Status === 'Success') {
          debugger;

          this.router.navigate(['register']);
          this.statusMessage = true;
        }
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
  onReset() {
    this.submitted = false;
    this.userForm.reset();
  }
  ngOnInit() {}
  nextStep() {
    this.currentStep++;
  }

  prevStep() {
    this.currentStep--;
  }

  submitForm() {
    this.showSuccessAlert();
    console.log('Form submitted!');
  }
  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.get('Password');
    const confirmPassword = control.get('ConfirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }

    return null;
  }
  confirmPasswordHasError() {
    const confirmPasswordControl = this.userForm.get('ConfirmPassword');
    return (
      confirmPasswordControl &&
      confirmPasswordControl.errors &&
      confirmPasswordControl.errors['passwordMismatch'] &&
      confirmPasswordControl.dirty
    );
  }
}
