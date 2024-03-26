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
  isRecentMetar:boolean = false;
  isRecentTafs:boolean = false;
  isMetarHistory: boolean = false;
  isDropdownOpen1: boolean = false;
  isDropdownOpen2: boolean = false;
  isDropdownOpen3: boolean = false;
  isDropdownOpen4: boolean = false;
  isDropdownOpen5: boolean = false;
  isDropdownOpen6: boolean = false;
  isDropdownOpen7: boolean = false;
  selectedOption1: string = 'Animation Type';
  selectedOption2: string = '2024-03-20 13:15';
  selectedOption3: string = 'FAVV';
  selectedOption4: string = 'Select Plot meteogram';
  selectedOption5: string = 'Select saved Template';
  selectedOption6: string = 'Last Hour';
  selectedOption7: string = '5 Min';
  webcamActive: boolean = false;

  
  constructor(
    private router: Router,
     private authService: AuthService, 
     private elRef: ElementRef,
    
    
 ) {}
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
  recentmeter(){
    
  }

  observatPage() {
    this.isMetar = true;
    this.isRanderImages = false;
    this.iscodeTafs = false;
    this.isObservMeter =false;
    this.issatelite= false;
    this.isSpeci = false;
    this.isMetarHistory = false;
    this.isRecentMetar = false;
    this.isRecentTafs= false
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

  MetarHistory() {
  this.isMetar = false;
  this.isMetarHistory = true;

  }

  RecentMetar(){
    this.isMetar = false;
    this.isRecentMetar = true
  }
  RecentTafs() {
    this.isMetar = false;
    this.isRecentTafs = true;
  }

  toggleDropdown(dropdown: string) {
    if (dropdown === 'dropdown1') {
      this.isDropdownOpen1 = !this.isDropdownOpen1;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen4 = false;
   
    }

    if (dropdown === 'dropdown2') {
      this.isDropdownOpen2 = !this.isDropdownOpen2;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen4 = false;
    
    }
    
    if (dropdown === 'dropdown3') {
      this.isDropdownOpen3 = !this.isDropdownOpen3;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen4 = false;
    
    }
    if (dropdown === 'dropdown4') {
      this.isDropdownOpen4 = !this.isDropdownOpen4;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen3 = false;
    
    }
    if (dropdown === 'dropdown5') {
      this.isDropdownOpen5 = !this.isDropdownOpen5;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen4 = false;
    
    }
    if (dropdown === 'dropdown6') {
      this.isDropdownOpen6 = !this.isDropdownOpen6;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen5 = false;
    
    }
    if (dropdown === 'dropdown7') {
      this.isDropdownOpen7 = !this.isDropdownOpen7;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen5 = false;
      this.isDropdownOpen6 = false;
    
    }
   
  }
  selectOption(option: string, dropdown: string) {
    if (dropdown === 'dropdown1') {
      this.selectedOption1 = option;
      this.isDropdownOpen1 = false;
    } 
    if (dropdown === 'dropdown2') {
      this.selectedOption2 = option;
      this.isDropdownOpen2 = false;
    }
    if (dropdown === 'dropdown3') {
      this.selectedOption3 = option;
      this.isDropdownOpen2 = false;
    }
    if (dropdown === 'dropdown4') {
      this.selectedOption4 = option;
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

  selectDropdown(dropdown: string) {
    if (dropdown === 'dropdown5') {
      this.isDropdownOpen5 = !this.isDropdownOpen5;
      this.isDropdownOpen6 = false;
      this.isDropdownOpen7 = false;
    
    }
    if (dropdown === 'dropdown6') {
      this.isDropdownOpen6 = !this.isDropdownOpen6;
      this.isDropdownOpen5 = false;
      this.isDropdownOpen7 = false;
    
    }
    if (dropdown === 'dropdown7') {
      this.isDropdownOpen7 = !this.isDropdownOpen7;
      this.isDropdownOpen6 = false;
      this.isDropdownOpen5 = false;
    
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




