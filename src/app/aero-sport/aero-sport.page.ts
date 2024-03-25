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
  isSpotGfraph: boolean = false;
  isTSProbability: boolean = false;
  isCloudForecast: boolean = false;
  isDropdownOpen1: boolean = false;
  isDropdownOpen2: boolean = false;
  isDropdownOpen3: boolean = false;
  isDropdownOpen4: boolean = false;
  isDropdownOpen5: boolean = false;
  selectedOption1: string = 'Wind';
  selectedOption2: string = 'Surface';
  selectedOption3: string = 'Temperature';
  selectedOption4: string = 'Total cloud';
  selectedOption5: string = '2023-03-20 20:00';
  nextday: boolean = true;
  prevday: boolean = false;

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

  forecastDropdown(dropdown: string) {
    if (dropdown === 'dropdown1') {
      this.isDropdownOpen1 = !this.isDropdownOpen1;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen5 = false;
    }

    if (dropdown === 'dropdown2') {
      this.isDropdownOpen2 = !this.isDropdownOpen2;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen5 = false;
    }
    if (dropdown === 'dropdown3') {
      this.isDropdownOpen3 = !this.isDropdownOpen3;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen5 = false;
    }

    if (dropdown === 'dropdown4') {
      this.isDropdownOpen4 = !this.isDropdownOpen4;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen5 = false;
    }
    if (dropdown === 'dropdown5') {
      this.isDropdownOpen5 = !this.isDropdownOpen5;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen4 = false;
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
    this.isSpotGfraph = false;
    this.isCloudForecast = false;
    this.isTSProbability = false;
  }
  toggleFormVisibility1() {
    this.isFormVisible = false;
    this.isKwazulNatal = false;
    this.isFormVisible1 = false;
    this.isFormVisible2 = true;
    this.isFormVisible3 = false;
    this.isSpotGfraph = false;
    this.isCloudForecast = false;
    this.isTSProbability = false;
  }
  toggleFormVisibility2() {
    this.isFormVisible = false;
    this.isKwazulNatal = false;
    this.isFormVisible1 = false;
    this.isFormVisible3 = true;
    this.isSpotGfraph = false;
    this.isCloudForecast = false;
    this.isTSProbability = false;
  }
  KwazulNatalToggle() {
    // this.isKwazulNatal=true;
    this.isFormVisible2 = false;
    this.isFormVisible = false;
    this.isKwazulNatal = true;
    this.isFormVisible = false;
    this.isSpotGfraph = false;
    this.isCloudForecast = false;
    this.isTSProbability = false;
  }
  SpotGraphToggle() {
    // this.isKwazulNatal=true;
    this.isFormVisible2 = false;
    this.isFormVisible = false;
    this.isKwazulNatal = false;
    this.isFormVisible = false;
    this.isSpotGfraph = true;
    this.isCloudForecast = false;
    this.isTSProbability = false;
  }
  TSProbability() {
    // this.isKwazulNatal=true;
    this.isFormVisible2 = false;
    this.isFormVisible = false;
    this.isKwazulNatal = false;
    this.isFormVisible = false;
    this.isSpotGfraph = false;
    this.isCloudForecast = false;
    this.isTSProbability = true;
  }
  aerosportPage() {
    this.router.navigate(['/landing-page']);
  }

  forecastPage() {
    this.isFormVisible = true;
    this.isKwazulNatal = false;
    this.isFormVisible1 = false;
    this.isFormVisible2 = false;
    this.isFormVisible3 = false;
    this.isSpotGfraph = false;
    this.isCloudForecast = false;
    this.isTSProbability = false;
  }
  CloudForecast() {
    this.isCloudForecast = true;
    this.isFormVisible = false;
    this.isKwazulNatal = false;
    this.isFormVisible1 = false;
    this.isFormVisible2 = false;
    this.isFormVisible3 = false;
    this.isSpotGfraph = false;
  }

  nextDay() {
    this.nextday = true;
    this.prevday = false;
  }
  previousDay() {
    this.nextday = false;
    this.prevday = true;
  }
}
