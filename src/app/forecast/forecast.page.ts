import {
  Component,
  inject,
  OnInit,
  ElementRef,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.page.html',
  styleUrls: ['./forecast.page.scss'],
})
export class ForecastPage implements OnInit {
  isLogged: boolean = false;
  isFormVisible: boolean = true;
  isform2Visible: boolean = true;
  iscodeTafs: boolean = false;
  isSigmentAirmet: boolean = false;
  isColorSigmentAirmet: boolean = false;
  iscolorCodedWarning: boolean = false;
  isWarning: boolean = false;
  isAdvesories: boolean = false;
  istakeOfData: boolean = false;
  isTAF: boolean = false;
  isRecentTAF: boolean = false;
  isTafAccuracy: boolean = false;
  isTrends: boolean = false;
  isHarmonized: boolean = false;
  isDropdownOpen1: boolean = false;
  isDropdownOpen2: boolean = false;
  isDropdownOpen3: boolean = false;
  selectedOption1: string = 'select saved Template';
  selectedOption2: string = 'Last Hour';
  selectedOption3: string = '5 minutes';
  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private iab: InAppBrowser,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {}
  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
  toggleFormVisibility() {
    this.isFormVisible = !this.isFormVisible;
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
      this.isDropdownOpen3 = false;
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
  LandingPage() {
    this.router.navigate(['/landing-page']);
  }
  forecastDropdown(dropdown: string) {
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
  ColorCoded() {
    this.iscodeTafs = true;
    this.isFormVisible = false;
    this.isSigmentAirmet = false;
    this.iscolorCodedWarning = false;
    this.isColorSigmentAirmet = false;
    this.isAdvesories = false;
    this.isWarning = false;
    this.istakeOfData = false;
    this.isTAF = false;
    this.isRecentTAF = false;
    this.isTafAccuracy = false;
    this.isTrends = false;
    this.isHarmonized = false;
  }

  forecastPage() {
    this.iscodeTafs = false;
    this.isFormVisible = true;
    this.isSigmentAirmet = false;
    this.iscolorCodedWarning = false;
    this.isColorSigmentAirmet = false;
    this.isAdvesories = false;
    this.isWarning = false;
    this.istakeOfData = false;
    this.isTAF = false;
    this.isRecentTAF = false;
    this.isTafAccuracy = false;
    this.isTrends = false;
    this.isHarmonized = false;
    this.isform2Visible = true && this.isLoggedIn == false;
  }
  ColorcodedSigmetAirmet() {
    this.iscodeTafs = false;
    this.isFormVisible = false;
    this.isSigmentAirmet = true;
    this.isColorSigmentAirmet = false;
    this.iscolorCodedWarning = false;
    this.isAdvesories = false;
    this.isWarning = false;
    this.istakeOfData = false;
    this.isTAF = false;
    this.isRecentTAF = false;
    this.isTafAccuracy = false;
    this.isTrends = false;
    this.isHarmonized = false;
  }
  SigmetAirmet() {
    this.iscodeTafs = false;
    this.isFormVisible = false;
    this.isSigmentAirmet = false;
    this.isColorSigmentAirmet = true;
    this.iscolorCodedWarning = false;
    this.isAdvesories = false;
    this.isWarning = false;
    this.istakeOfData = false;
    this.isTAF = false;
    this.isRecentTAF = false;
    this.isTafAccuracy = false;
    this.isTrends = false;
    this.isHarmonized = false;
    this.isform2Visible = false && this.isLoggedIn == false;
  }
  ColorcodedWarning() {
    this.iscodeTafs = false;
    this.isFormVisible = false;
    this.isSigmentAirmet = false;
    this.isColorSigmentAirmet = false;
    this.iscolorCodedWarning = true;
    this.isAdvesories = false;
    this.isWarning = false;
    this.istakeOfData = false;
    this.isTAF = false;
    this.isRecentTAF = false;
    this.isTafAccuracy = false;
    this.isTrends = false;
    this.isHarmonized = false;
  }
  Advesories() {
    this.iscodeTafs = false;
    this.isFormVisible = false;
    this.isSigmentAirmet = false;
    this.isColorSigmentAirmet = false;
    this.iscolorCodedWarning = false;
    this.isAdvesories = true;
    this.isWarning = false;
    this.istakeOfData = false;
    this.isTAF = false;
    this.isRecentTAF = false;
    this.isTafAccuracy = false;
    this.isTrends = false;
    this.isHarmonized = false;
    this.isform2Visible = false && this.isLoggedIn == false;

    debugger;
    this.spinner.show();
      this.router.navigate(['/advisories']);

  }
  Warning() {
    this.iscodeTafs = false;
    this.isFormVisible = false;
    this.isSigmentAirmet = false;
    this.isColorSigmentAirmet = false;
    this.iscolorCodedWarning = false;
    this.isAdvesories = false;
    this.isWarning = true;
    this.istakeOfData = false;
    this.isTAF = false;
    this.isRecentTAF = false;
    this.isTafAccuracy = false;
    this.isTrends = false;
    this.isHarmonized = false;
  }
  TakeOfData() {
    this.iscodeTafs = false;
    this.isFormVisible = false;
    this.isSigmentAirmet = false;
    this.isColorSigmentAirmet = false;
    this.iscolorCodedWarning = false;
    this.isAdvesories = false;
    this.isWarning = false;
    this.istakeOfData = true;
    this.isTAF = false;
    this.isRecentTAF = false;
    this.isTafAccuracy = false;
    this.isTrends = false;
    this.isHarmonized = false;
  }
  TAF() {
    this.iscodeTafs = false;
    this.isFormVisible = false;
    this.isSigmentAirmet = false;
    this.isColorSigmentAirmet = false;
    this.iscolorCodedWarning = false;
    this.isAdvesories = false;
    this.isWarning = false;
    this.istakeOfData = false;
    this.isTAF = true;
    this.isRecentTAF = false;
    this.isTafAccuracy = false;
    this.isTrends = false;
    this.isHarmonized = false;
    this.isform2Visible = false && this.isLoggedIn == false;
  }
  RecentTAF() {
    this.iscodeTafs = false;
    this.isFormVisible = false;
    this.isSigmentAirmet = false;
    this.isColorSigmentAirmet = false;
    this.iscolorCodedWarning = false;
    this.isAdvesories = false;
    this.isWarning = false;
    this.istakeOfData = false;
    this.isTAF = false;
    this.isRecentTAF = true;
    this.isTafAccuracy = false;
    this.isTrends = false;
    this.isHarmonized = false;
    this.isform2Visible = false && this.isLoggedIn == false;
  }
  tafAccuracy() {
    this.iscodeTafs = false;
    this.isFormVisible = false;
    this.isSigmentAirmet = false;
    this.isColorSigmentAirmet = false;
    this.iscolorCodedWarning = false;
    this.isAdvesories = false;
    this.isWarning = false;
    this.istakeOfData = false;
    this.isTAF = false;
    this.isRecentTAF = false;
    this.isTafAccuracy = true;
    this.isTrends = false;
    this.isHarmonized = false;
  }
  Trends() {
    this.iscodeTafs = false;
    this.isFormVisible = false;
    this.isSigmentAirmet = false;
    this.isColorSigmentAirmet = false;
    this.iscolorCodedWarning = false;
    this.isAdvesories = false;
    this.isWarning = false;
    this.istakeOfData = false;
    this.isTAF = false;
    this.isRecentTAF = false;
    this.isTafAccuracy = false;
    this.isTrends = true;
    this.isHarmonized = false;
  }
  harmonized() {
    this.iscodeTafs = false;
    this.isFormVisible = false;
    this.isSigmentAirmet = false;
    this.isColorSigmentAirmet = false;
    this.iscolorCodedWarning = false;
    this.isAdvesories = false;
    this.isWarning = false;
    this.istakeOfData = false;
    this.isTAF = false;
    this.isRecentTAF = false;
    this.isTafAccuracy = false;
    this.isTrends = false;
    this.isHarmonized = true;
  }
}
