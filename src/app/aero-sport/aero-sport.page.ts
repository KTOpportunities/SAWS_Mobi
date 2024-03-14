import {
  Component,
  inject,
  OnInit,
  ElementRef,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-aero-sport',
  templateUrl: './aero-sport.page.html',
  styleUrls: ['./aero-sport.page.scss'],
})
export class AeroSportPage implements OnInit {
  isLogged: boolean = false;
  isFormVisible: boolean = true;
  isFormVisible1: boolean = false;
  isFormVisible2: boolean = false;
  isFormVisible3: boolean = false;
  isKwazulNatal: boolean = false;
  isDropdownOpen1: boolean = false;
  isDropdownOpen2: boolean = false;
  isDropdownOpen3: boolean = false;
  selectedOption1: string = 'Wind';
  selectedOption2: string = 'Surface';
  selectedOption3: string = 'Temperature';

  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef
  ) {}

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
    this.isFormVisible = false;
    this.isKwazulNatal = false;
    this.isFormVisible1 = true;
    this.isFormVisible2 = false;
    this.isFormVisible3 = false;
  }
  toggleFormVisibility1() {
    this.isFormVisible = false;
    this.isKwazulNatal = false;
    this.isFormVisible1 = false;
    this.isFormVisible2 = true;
    this.isFormVisible3 = false;
  }
  toggleFormVisibility2() {
    this.isFormVisible = false;
    this.isKwazulNatal = false;
    this.isFormVisible1 = false;
    this.isFormVisible3 = true;
  }
  KwazulNatalToggle() {
    // this.isKwazulNatal=true;
    this.isFormVisible2 = false;
    this.isFormVisible = false;
    this.isKwazulNatal = true;
    this.isFormVisible = false;
  }

  aerosportPage() {
    this.router.navigate(['/landing-page']);
  }

  forecastPage() {
    this.router.navigate(['/landing-page']);
  }
}
