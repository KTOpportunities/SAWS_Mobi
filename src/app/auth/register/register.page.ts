import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  @ViewChild('userFormRef') userFormRef!: ElementRef;
  showPassword: boolean = false;
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
  scrollToForm() {
    if (this.userFormRef) {
      this.userFormRef.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private api: APIService,
    private router: Router,
    private renderer: Renderer2
  ) {
    this.userForm = this.formBuilder.group({
      Fullname: ['', Validators.required],
      Username: ['', Validators.required],
      Email: ['', [Validators.required, this.emailValidator]],
      Password: ['', [Validators.required, this.passwordValidator]],
      ConfirmPassword: ['', Validators.required],
      UserRole: ['Subscriber', Validators.required],
    });
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword; // Toggle the visibility

    const passwordField = document.getElementById(
      'Password'
    ) as HTMLInputElement;
    const confirmPasswordField = document.getElementById(
      'ConfirmPassword'
    ) as HTMLInputElement;

    // Toggle the type of both password fields based on the showPassword flag
    passwordField.type = this.showPassword ? 'text' : 'password';
    confirmPasswordField.type = this.showPassword ? 'text' : 'password';
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
  passwordValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const value: string = control.value;
    const hasCapitalLetter = /[A-Z]/.test(value);
    const hasSmallLetter = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const isValidLength = value.length >= 8;

    if (!hasCapitalLetter || !hasSmallLetter || !hasNumber || !isValidLength) {
      return { invalidPassword: true };
    }

    return null;
  }

  onSubmit() {
    this.submitted = true;
    this.userForm.markAllAsTouched();
    this.scrollToForm();

    const password = this.userForm.controls['Password'].value;
    const confirmPassword = this.userForm.controls['ConfirmPassword'].value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Password and confirm password do not match.';
      return;
    }

    var body = {
      Fullname: this.userForm.controls['Fullname'].value,
      Username: this.userForm.controls['Username'].value,
      Email: this.userForm.controls['Email'].value,
      Password: this.userForm.controls['Password'].value,
      UserRole: this.userForm.controls['UserRole'].value,
    };

    console.log('BODY:', body);
    if (this.userForm.invalid) {
      return;
    } else {
      this.api.createNewUser(body).subscribe((data: any) => {
        console.log('SAVED:', data);
        // this.nextStep();
        if (data.Status === 'Success') {
          this.router.navigate(['register']);
          this.statusMessage = true;
          this.onReset();
        }
      });
    }
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
    console.log('Form submitted!');
  }
}
