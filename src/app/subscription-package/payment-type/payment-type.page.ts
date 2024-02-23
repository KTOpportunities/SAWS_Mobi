import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-payment-type',
  templateUrl: './payment-type.page.html',
  styleUrls: ['../../../app/subscription-package/subscription-package.page.scss'],
})
export class PaymentTypePage implements OnInit {
 // Boolean variables to track the visibility of sections
 showAnnuallySection: boolean = true;
 showMonthlySection: boolean = false;

 isSubscriber: boolean = true;
 selectedServices: string[] = [];
 selectedService: string = '';
 
 dropdownVisible: {[key: string]: boolean} = {
   'paymentType': false,
   'freeSubscription': false,
   'premiumSubscription': false,
   'regulatedSubscription': false
 };
 constructor( private router: Router ) { }

 ngOnInit() {
  // Check the subscription status to determine if the user is a subscriber
  this.isSubscriber = this.checkSubscriptionStatus();

  // Set the initial section visibility based on the subscription status
  if (this.isSubscriber) {
    // If the user is a subscriber, show the monthly section by default
    this.showMonthlySection = true;
    this.showAnnuallySection = false;
  } else {
    // If the user is not a subscriber, show the annually section by default
    this.showMonthlySection = false;
    this.showAnnuallySection = true;
  }
}



// Method to check the subscription status, you need to implement this based on your logic
checkSubscriptionStatus(): boolean {
  // Implement your logic to check if the user is a subscriber
  // For example, you can call a method from your AuthService
  // For demonstration, let's assume the user is a subscriber
  return true;
}


displayIcon(): boolean {
  return this.isSubscriber; // Return true if the user is a subscriber, false otherwise
}


toggleMonthlySection() {
  // Only toggle if the monthly section is not already active and the user is a subscriber
  if (!this.showMonthlySection && this.isSubscriber) {
    this.showMonthlySection = true;
    this.showAnnuallySection = false;
  }
}

toggleAnnuallySection() {
  // Only toggle if the annually section is not already active and the user is a subscriber
  if (!this.showAnnuallySection && this.isSubscriber) {
    this.showAnnuallySection = true;
    this.showMonthlySection = false;
  }
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
selectService(service: string) {
  if (!this.selectedServices.includes(service)) {
    this.selectedServices.push(service);
  }
  this.selectedService = service; // Update the selected service for the dropdown toggle button
  // Close the dropdown after selecting a service
  this.dropdownVisible['freeSubscription'] = false;
  this.dropdownVisible['premiumSubscription'] = false;
  this.dropdownVisible['regulatedSubscription']= false;
}
GoToAnnuallyPage() {
  this.router.navigate(['/subscription-package/payment-type', { paymentType: 'annually' }]);
}

GoToMonthlyPage() {
  this.router.navigate(['/subscription-package/payment-type', { paymentType: 'monthly' }]);
}


forecastPage() {
  this.router.navigate(['/landing-page']);
}


}
