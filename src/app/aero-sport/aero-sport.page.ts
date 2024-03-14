import { Component, inject, OnInit,ElementRef,HostListener  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-aero-sport',
  templateUrl: './aero-sport.page.html',
  styleUrls: ['./aero-sport.page.scss'],
})
export class AeroSportPage implements OnInit {
  isLogged: boolean = false;
  isFormVisible: boolean = false;
  isFormVisible1: boolean = false;
  isFormVisible2: boolean = false;
  isDropdownOpen1: boolean = false;
  isDropdownOpen2: boolean = false;
  isDropdownOpen3: boolean = false;
  selectedOption1: string = 'Wind';
  selectedOption2: string = 'Surface';
  selectedOption3: string = 'Temperature';

  constructor(private router: Router, 
    private authService: AuthService, private elRef: ElementRef) {}

  ngOnInit() {
    // Check if user is logged in
    if (!this.authService.getIsLoggedIn()) {
     // If not logged in, navigate to the login page
     this.router.navigate(['/login']);
   }

 }
 @HostListener('document:click', ['$event'])
 onClick(event: MouseEvent) {
   if (!this.elRef.nativeElement.contains(event.target)) {
     this.closeAllDropdowns();
   }
 }
 toggleDropdown(dropdown: string) {
  if (dropdown === 'dropdown1') {
    this.isDropdownOpen1 = !this.isDropdownOpen1;
    this.isDropdownOpen2 = false;
    this.isDropdownOpen3 = false;
  }

   if (dropdown === 'dropdown2') {
    this.isDropdownOpen2 = !this.isDropdownOpen2;
    this.isDropdownOpen1 = false;
    this.isDropdownOpen3 = false;
  }
  if (dropdown === 'dropdown3') {
    this.isDropdownOpen3 = !this.isDropdownOpen3;
    this.isDropdownOpen1 = false;
    this.isDropdownOpen2 = false;
  }
}
selectOption(option: string, dropdown: string) {
  if (dropdown === 'dropdown1') {
    this.selectedOption1 = option;
    this.isDropdownOpen1 = false;
  } else if (dropdown === 'dropdown2') {
    this.selectedOption2 = option;
    this.isDropdownOpen2 = false;
  }
}
 closeAllDropdowns() {
  this.isDropdownOpen1 = false;
  this.isDropdownOpen2 = false;
}

 get isLoggedIn(): boolean {
   return this.authService.getIsLoggedIn();
 }

 toggleFormVisibility() {
  this.isFormVisible = true;
}
toggleFormVisibility1() {
  this.isFormVisible = true;
}
toggleFormVisibility2() {
  this.isFormVisible = true;
}


  aerosportPage() {
    this.router.navigate(['/landing-page']);
  }

  
  forecastPage() {
    this.router.navigate(['/landing-page']);
  }

}
