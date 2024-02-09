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
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    // Adjust your layout here based on the window size
  }
  @ViewChild('content') content!: ElementRef;

  // Call this method when the keyboard is opened
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
    private router: Router
  ) {
    this.userForm = this.formBuilder.group({
      Email: ['', [Validators.required, this.emailValidator]],
    });
  }

  // onSubmit() {
  //   this.submitted = true;

  //   var body = {
  //     Email: this.userForm.controls['Email'].value,
  //   };

  //   console.log('BODY:', body);
  //   if (this.userForm.invalid) {
  //     return;
  //   } else {
  //     this.api.RequestPasswordReset(body).subscribe((data: any) => {
  //       debugger;
  //       if (data.response == 'Invalid Email') {
  //         this.errorMessage = true;
  //       } else {
  //         debugger;
  //         console.log('SAVED:', data);

  //         this.router.navigate(['forgot-password']);
  //         this.statusMessage = true;
  //       }
  //     });
  //   }
  // }

  onSubmit() {
    this.submitted = true;

    var body = {
      Email: this.userForm.controls['Email'].value,
    };

    console.log('BODY:', body);
    if (this.userForm.invalid) {
      return;
    } else {
      this.api.RequestPasswordReset(body).subscribe(
        (data: any) => {
          debugger;
          console.log('SAVED:', data);

          this.router.navigate([this.router.url]);
          this.statusMessage = true;
        },
        (error) => {
          console.error('Error:', error);
          debugger;
          if (
            error &&
            error.error &&
            error.error.response === 'Invalid email'
          ) {
            debugger;
            this.router.navigate(['/forgot-password']);
            // Handle the case when the email doesn't exist
            this.errorMgs = 'The provided email does not exist.';
          } else {
            // Handle other types of errors
           
          }
          this.loading = false;
        }
      );
    }
  }

  onReset() {
    this.submitted = false;
    this.userForm.reset();
  }
  ngOnInit() {}

  submitForm() {
 
    console.log('Form submitted!');
  }
}
