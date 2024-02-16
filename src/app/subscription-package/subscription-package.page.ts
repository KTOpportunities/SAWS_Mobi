import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subscription-package',
  templateUrl: './subscription-package.page.html',
  styleUrls: ['./subscription-package.page.scss'],
})
export class SubscriptionPackagePage implements OnInit {
  isSubscriber: boolean = true;
  dropdownVisible1: boolean = false; // Variable to control main dropdown visibility
  dropdownVisible2: boolean = false; // Variable to control dropdown visibility for the first dropdown
  dropdownVisible3: boolean = false; // Variable to control dropdown visibility for the second dropdown
 
  constructor() { }

  ngOnInit() {
  }

  displayIcon(): boolean {
    return this.isSubscriber; // Return true if the user is a subscriber, false otherwise
  }
  

  toggleDropdown(dropdownId: string): void {
    if (dropdownId === 'dropdownVisible1') {
      // Toggle visibility for the first dropdown
      this.dropdownVisible1 = !this.dropdownVisible1;
      // Close other dropdowns if they are open
      this.dropdownVisible2 = false;
      this.dropdownVisible3 = false;
    } else if (dropdownId === 'dropdownVisible2') {
      // Toggle visibility for the second dropdown
      this.dropdownVisible2 = !this.dropdownVisible2;
      // Close other dropdowns if they are open
      this.dropdownVisible1 = false;
      this.dropdownVisible3 = false;
    } else if (dropdownId === 'dropdownVisible3') {
      // Toggle visibility for the third dropdown
      this.dropdownVisible3 = !this.dropdownVisible3;
      // Close other dropdowns if they are open
      this.dropdownVisible1 = false;
      this.dropdownVisible2 = false;
    }
  }
}
