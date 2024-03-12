                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-subscription-package',
  templateUrl: './subscription-package.page.html',
  styleUrls: ['./subscription-package.page.scss'],
})
export class SubscriptionPackagePage implements OnInit {
  showAnnuallySection: boolean = false;
  showMonthlySection: boolean = true;
  isSubscriber: boolean = true;
  dropdownVisible: {[key: string]: boolean} = {
    'paymentType': false,
    'freeSubscription': false,
    'premiumSubscription': false,
    'regulatedSubscription': false
  };
  selectedPaymentType: string | undefined;
  constructor(private router:Router,private authService: AuthService,) { }
  

  ngOnInit() {
    this.selectedPaymentType = 'monthly';
  }
  
    get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
  provideFeedback() {
   
      this.router.navigate(['/login']);
    
  }
  displayIcon(): boolean {
    return this.isSubscriber; // Return true if the user is a subscriber, false otherwise
  }
  

  toggleDropdown(dropdownName: string) {
    // Close all dropdowns
    for (let key in this.dropdownVisible) {
      if (key !== dropdownName) {
        this.dropdownVisible[key] = false;
      }
    }

    // Toggle the specified dropdown
    this.dropdownVisible[dropdownName] = !this.dropdownVisible[dropdownName];
  }


  
  forecastPage() {
    this.router.navigate(['/landing-page']);
  }
  forecastPage2() {
    this.router.navigate(['/landing-page'])
  }
  monthlypage() {
    this.selectedPaymentType = 'monthly'; // Update selected payment type
    this.router.navigate(['/subscription-package/payment-type', { paymentType: 'monthly' }]);
  }
  
  annualypage() {
    this.selectedPaymentType = ''; // Update selected payment type
    this.router.navigate(['/subscription-package/payment-type', { paymentType: 'annually' }]);
  }
  

  // private navigateToPaymentTypePage() {
   
  //   this.router.navigate(['/subscription-package/payment-type', { paymentType: this.selectedPaymentType }]);
  // }

 
  
  
  toggleMonthlySection() {
    console.log('toggleMonthlySection() called');
    // this.showMonthlySection = true;
    // this.showAnnuallySection = false;

  }

  GoToInternational() {
    this.router.navigate(['/international']);
  }
  GoToForecast() {
    this.router.navigate(['/forecast']);
  }
  GoTODomestic() {
    this.router.navigate(['/domestic']);
  }
  GoTOFlieghtBrief() {
    this.router.navigate(['/flight-briefing']);
  }
  GoToObservation() {
    this.router.navigate(['/observation']);
  }
  
  }
  

