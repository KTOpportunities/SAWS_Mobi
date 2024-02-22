                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-subscription-package',
  templateUrl: './subscription-package.page.html',
  styleUrls: ['./subscription-package.page.scss'],
})
export class SubscriptionPackagePage implements OnInit {
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
    this.router.navigate(['/alnding-page'])
  }

  annualypage() {
    this.selectedPaymentType = 'annually'; // Update selected payment type
    this.router.navigate(['/subscription-package/payment-type'])
  }
  monthlypage() {
    this.selectedPaymentType = 'monthly'; // Update selected payment type
    this.router.navigate(['/subscription-package/payment-type']);
  }
}
