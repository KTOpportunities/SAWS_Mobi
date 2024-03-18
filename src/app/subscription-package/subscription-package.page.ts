import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { APIService } from 'src/app/services/apis.service';

@Component({
  selector: 'app-subscription-package',
  templateUrl: './subscription-package.page.html',
  styleUrls: ['./subscription-package.page.scss'],
})
export class SubscriptionPackagePage implements OnInit {
  selectedSubscriptionPackageId: number | undefined;
  showAnnuallySection: boolean = false;
  showMonthlySection: boolean = true;
  isSubscriber: boolean = true;
  subscriptionId:number|undefined;
  dropdownVisible: { [key: string]: boolean } = {
    paymentType: false,
    freeSubscription: false,
    premiumSubscription: false,
    regulatedSubscription: false,
  };
  selectedPaymentType: string | undefined;

  subsObj: any = {
    returnUrl: '',
    cancelUrl: '',
    notifyUrl: '',
    name_first: 'test_User',
    name_last: 'test',
    email_address: 'raymond.mortu@gmail.com',
    m_payment_id: 'SAW_test_1',
    item_name: 'SAW Recurring subscription',
    item_description: 'Premium',
    email_confirmation: true,
    confirmation_email: 'raymond.mortu@gmail.com',
    amount: 500.0,
    recurring_amount: 500.0,
    frequency: 'annual',
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private iab: InAppBrowser,
    private APIService: APIService,
    private route: ActivatedRoute,
    private api: APIService,

  ) {}
 
  ngOnInit() {

    if(this.authService.getIsLoggedIn()){
      var user: any = this.authService.getCurrentUser();
    }
    if (user) {
      // Populate subsObj with user's information
      this.subsObj.name_first = user.firstName;
      this.subsObj.name_last = user.lastName;
      this.subsObj.email_address = user.email;
      this.subsObj.confirmation_email = user.email;
    }
    this.route.queryParams.subscribe(params => {
      this.subscriptionId = +params['id'];
      // Optionally, you can perform any actions based on the subscription package ID here
    });
    this.selectedPaymentType = 'monthly';

    const currentUrl = window.location.href;
    console.log(currentUrl);
    this.subsObj.returnUrl = currentUrl;

    let ID = 1;
    if (this.subscriptionId == 1) {
      this.subscribe(180);
    } else if (this.subscriptionId == 2) {
      this.subscribe(380);
    }
  }

  openInAppBrowser(url: string) {
    const browser = this.iab.create(url, '_blank', {
      location: 'no',
      hidden: 'no',
      hardwareback: 'yes',
      zoom: 'no',
      //hideurlbar: 'yes',
    });
  }

  subscribe(amount: number, subscriptionType?: string) {
    this.subsObj.amount = Number(amount.toFixed(2));
    this.subsObj.recurring_amount = Number(amount.toFixed(2));
    
    
    console.log('subO: ', this.subsObj);
    debugger;

    this.APIService.paySubscription(this.subsObj).subscribe(
      (payRes: any) => {
        console.log('url: ', payRes.url);
        this.openInAppBrowser(payRes.url);
      },
      (err) => {
        console.log('error: ', err);
      }
    );
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
  // provideFeedback() {
  //   if (this.authService.getIsLoggedIn()) {
  //     // If user is logged in, redirect to subscription package page with ID parameter
  //     this.authService.setRedirectUrl('/subscription-package');
  //   } else {
  //     // If user is not logged in, set the redirect URL and navigate to the login page
  //     this.authService.setRedirectUrl('/subscription-package');
  //     this.router.navigate(['/login']);
  //   }
  // }
  provideFeedback(subscriptionPackageId: number, amount?: number) {
    // Check if the user is logged in
    if (!this.authService.getIsLoggedIn()) {
      // If not logged in, set redirect URL and navigate to login page
      this.authService.setRedirectUrl(
        `/subscription-package?id=${subscriptionPackageId}`
      );
      this.router.navigate(['/login']);
      return; // Exit the method
    } else {
      this.subscribe(amount!);
    }

    // User is logged in, perform subscription process
    // Here, you can handle subscription based on the provided package ID
    this.selectedSubscriptionPackageId = subscriptionPackageId;
    // Implement your subscription logic...
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
    this.router.navigate(['/alnding-page']);
  }
  monthlypage() {
    this.selectedPaymentType = 'monthly'; // Update selected payment type
    this.router.navigate([
      '/subscription-package/payment-type',
      { paymentType: 'monthly' },
    ]);
  }

  annualypage() {
    this.selectedPaymentType = ''; // Update selected payment type
    this.router.navigate([
      '/subscription-package/payment-type',
      { paymentType: 'annually' },
    ]);
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
