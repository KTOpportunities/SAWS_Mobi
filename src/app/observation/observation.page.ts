import { Component, OnInit,ElementRef,
  HostListener, } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-observation',
  templateUrl: './observation.page.html',
  styleUrls: ['./observation.page.scss'],
})
export class ObservationPage implements OnInit {
  
  isLogged: boolean = false;
  isMetar:boolean = true;
  isRanderImages:boolean = false;
  isObservMeter: boolean = false;
  iscodeTafs:boolean = false;
  issatelite:boolean = false;
  isSpeci:boolean =false
  isDropdownOpen1: boolean = false;
  isDropdownOpen2: boolean = false;
  selectedOption1: string = 'Animation Type';
  selectedOption2: string = '2024-03-20 13:15';


  webcamActive: boolean = false;
  constructor(private router: Router, private authService: AuthService, private elRef: ElementRef) {}
  ngOnInit() {}
  
  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
  metar () {
    this.isMetar = false;
    this.isRanderImages = true
  }
  satelite() {
    this.isMetar= false;
    this.issatelite = true
  }
  speci () {
    this.isMetar = false;
    this.isSpeci = true
  }

  observatPage() {
    this.isMetar = true;
    this.isRanderImages = false;
    this.iscodeTafs = false;
    this.isObservMeter =false;
    this.issatelite= false;
    this.isSpeci = false
  }

  colorcoded () {
  this.isMetar = false;
  this.iscodeTafs = true
  }
  ObservMeter () {
    this.isMetar = false;
    this.isObservMeter = true
    this.router.navigate (['/observation'])
  }

  toggleDropdown(dropdown: string) {
    if (dropdown === 'dropdown1') {
      this.isDropdownOpen1 = !this.isDropdownOpen1;
      this.isDropdownOpen2 = false;
   
    }

    if (dropdown === 'dropdown2') {
      this.isDropdownOpen2 = !this.isDropdownOpen2;
      this.isDropdownOpen1 = false;
    
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

  sateliteDropdown(dropdown: string) {
    if (dropdown === 'dropdown1') {
      this.isDropdownOpen1 = !this.isDropdownOpen1;
      this.isDropdownOpen2 = false;
   
    }

    if (dropdown === 'dropdown2') {
      this.isDropdownOpen2 = !this.isDropdownOpen2;
      this.isDropdownOpen1 = false;
    
    }
   
  }
  closeAllDropdowns() {
    this.isDropdownOpen1 = false;
    this.isDropdownOpen2 = false;
  }

  


  observPage() {
    this.router.navigate(['/landing-page']);
  }
  observMetarPage() {
    // this.router.navigate(['/news']);
    this.router.navigate(['/web-cam']);
  }
 
}
