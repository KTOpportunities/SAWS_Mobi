import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-annually',
  templateUrl: './annually.page.html',
  styleUrls: ['../../../app/subscription-package/subscription-package.page.scss'],
})
export class AnnuallyPage implements OnInit {
  isSubscriber: boolean = true;
  selectedServices: string[] = [];
  selectedService: string = '';
  
  dropdownVisible: {[key: string]: boolean} = {
    'paymentType': false,
    'freeSubscription': false,
    'premiumSubscription': false,
    'regulatedSubscription': false
  };
  constructor(private router:Router) { }

  ngOnInit() {
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


  forecastPage() {
    this.router.navigate(['/landing-page']);
  }

}
