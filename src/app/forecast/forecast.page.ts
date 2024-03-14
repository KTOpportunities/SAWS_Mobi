import { Component, inject, OnInit,ElementRef,HostListener  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.page.html',
  styleUrls: ['./forecast.page.scss'],
})
export class ForecastPage implements OnInit {
  isLogged: boolean = false;
  isFormVisible: boolean = false;
  // dropdownVisible: { [key: string]: boolean } = {
  //   dropdown: false,
  //   wind: false,
  //   temperature: false
  // };
  constructor(private router: Router,
     private authService: AuthService,private elRef: ElementRef) {}

  ngOnInit() {}
  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      // this.isDropdownOpen = false;
    }
  }

  // toggleDropdown(dropdownName: string) {
  //   // Close all dropdowns
  //   for (let key in this.dropdownVisible) {
  //     if (key !== dropdownName) {
  //       this.dropdownVisible[key] = false;
  //     }
  //   }


  //   this.dropdownVisible[dropdownName] = !this.dropdownVisible[dropdownName];
  // }



  toggleFormVisibility() {
    this.isFormVisible = !this.isFormVisible;
  }
  forecastPage() {
    this.router.navigate(['/landing-page']);
  }
 
}
