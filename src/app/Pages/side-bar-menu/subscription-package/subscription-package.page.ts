import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { APIService } from 'src/app/services/apis.service';
import { take, filter } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ActionSheetController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-subscription-package',
  templateUrl: './subscription-package.page.html',
  styleUrls: ['./subscription-package.page.scss'],
})
export class SubscriptionPackagePage implements OnInit {
  selectedSubscriptionPackageId: number | undefined;
  selectedSubscriptionPackageAmount: number | undefined;
  cancelSubscriptionId: number | undefined;
  showAnnuallySection: boolean = false;
  showMonthlySection: boolean = true;
  isSubscriber: boolean = true;

  isSubscriptionSwitch: boolean = false;

  isSubscribedPremiumMonthly: boolean = false;
  isSubscribedPremiumAnnually: boolean = false;
  isSubscriberRegulatedMonthly: boolean = false;
  isSubscriberRegulatedAnnually: boolean = false;

  subscriptionId: number | undefined;
  dropdownVisible: { [key: string]: boolean } = {
    paymentType: false,
    freeSubscription: false,
    premiumSubscription: false,
    regulatedSubscription: false,
  };

  // selectedPaymentType: string | undefined ;
  selectedPaymentType: string = 'monthly';
  subscriptionType: string = '';

  freeSubscriptionAmount: number = 0;
  premiumSubscriptionAmount: number = 180;
  regulatedSubscriptionAmount: number = 380;

  freeSubscriptionId: number = 1;
  premiumSubscriptionId: number = 2;
  regulatedSubscriptionId: number = 3;

  premiumMontlySubscribedId: number = 0;
  premiumAnnuallySubscribedId: number = 0;
  regulateMonthlydSubscribedId: number = 0;
  regulateAnnuallydSubscribedId: number = 0;

  // selectedService: string | null = null;
  selectedFreeService: string | null = null;
  selectedPremiumService: string | null = null;
  selectedRegulatedService: string | null = null;

  token: string = '';
  subsArray: any = [];
  filteredSubscriptions: any = [];
  actionSheetSubHeader: string = '';
  loading = false;

  subsObj: any = {
    returnUrl: '',
    cancelUrl: '',
    notifyUrl: '',
    name_first: 'test_User',
    name_last: 'test',
    userId: 0,
    email_address: 'raymond.mortu@gmail.com',
    m_payment_id: 'SAW_test_1',
    item_name: 'SAW Recurring subscription',
    item_description: 'Premium',
    email_confirmation: true,
    confirmation_email: 'raymond.mortu@gmail.com',
    amount: 500.0,
    recurring_amount: 500.0,
    frequency: 'annual',
    package_id: 0,
    subscription_amount: 500.0,
    package_name: 'monthly Premium',
    subscription_type: 'monthly',
  };

  public actionSheetButtonsCancel = [
    {
      text: 'Unsubscribe',
      role: 'destructive',
      icon: 'trash-outline',
      data: {
        action: 'delete',
      },
      handler: () => {
        this.handleAction('delete');
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      icon: 'close',
      data: {
        action: 'cancel',
      },
      handler: () => {
        this.handleAction('cancel');
      },
    },
  ];

  public actionSheetButtonsCancelFreeSub = [
    {
      text: 'Cancel',
      role: 'cancel',
      icon: 'close',
      data: {
        action: 'cancel',
      },
      handler: () => {
        this.handleAction('cancel');
      },
    },
  ];

  public actionSheetButtonsSwitch = [
    {
      text: 'Change Subscription',
      icon: 'sync',
      data: {
        action: 'subscribe',
      },
      handler: () => {
        this.handleAction('subscribe');
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      icon: 'close',
      data: {
        action: 'cancel',
      },
      handler: () => {
        this.handleAction('cancel');
      },
    },
  ];

  browser: any;

  updateSub: any = {
    subscriptionId: '',
    userprofileid: 0,
    package_name: '',
    package_id: 0,
    package_price: 0,
    start_date: Date.now(),
    end_date: Date.now(),
    subscription_duration: 0,
    subscription_token: '',
    subscription_status: 'Active',
  };

  freeSlides = ['International', 'Observation', 'Forecast', 'Other'];
  premiumSlides = [
    'International',
    'Domestic',
    'Flight Briefing',
    'Observation',
    'Forecast',
    'Aerospot',
    'Other',
  ];
  regulatedSlides = [
    'International',
    'Domestic',
    'Flight Briefing',
    'Observation',
    'Forecast',
    'Aerospot',
    'Other',
  ];
  currentFreeSlide = 0;
  currentPremiumSlide = 0;
  currentRegulatedSlide = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private iab: InAppBrowser,
    private APIService: APIService,
    private route: ActivatedRoute,
    private api: APIService,
    public plat: Platform,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController
  ) {}

  ionViewWillEnter() {
    this.route.queryParams.subscribe((params) => {
      this.subscriptionId = params['id'];
      // Optionally, you can perform any actions based on the subscription package ID here
    });

    // If the user is logged in
    if (this.subscriptionId) {
      // this.subscribe(this.premiumSubscriptionAmount, this.subscriptionId);
      this.CheckSubscriptionStatus(
        this.subscriptionId,
        this.selectedSubscriptionPackageAmount
      );
    }
  }

  ionViewDidLeave() {
    if (this.authService.getIsToReturnToSub()) {
      this.router.navigate(['/subscription-package']);
      this.authService.setIsToReturnToSub(false);
    }
  }

  ngOnInit() {

    if (this.authService.getIsLoggedIn()) {
      this.GetSubscriptions();
    }

    // PayFast requires public http(s) URLs for return_url/cancel_url.
    // The backend will now own these URLs; keep the app aligned so InAppBrowser auto-close works.
    // Use API-side return/cancel endpoints (must be publicly reachable via HTTPS).
    const apiBase = (environment.serverAPI ?? '').trim();
    const apiBaseNormalized = apiBase.endsWith('/') ? apiBase : apiBase + '/';

    if (apiBaseNormalized.toLowerCase().startsWith('https://')) {
      this.subsObj.returnUrl = `${apiBaseNormalized}v1/subscriptions/payfast/return`;
      this.subsObj.cancelUrl = `${apiBaseNormalized}v1/subscriptions/payfast/cancel`;
    } else {
      // Fallback to previous behavior (may fail on iOS if not http(s)).
      const currentUrl = window.location.href;
      console.log(currentUrl);
      const landingPage = currentUrl.substr(0, currentUrl.lastIndexOf('/') + 1);
      console.log(landingPage + 'subscription-Successful');
      this.subsObj.returnUrl = landingPage + 'subscription-successful';
      this.subsObj.cancelUrl = landingPage + 'subscription-package';
    }

    // Server-to-server notification endpoint (IPN)
    this.subsObj.notifyUrl = environment.serverAPI + 'v1/Subscriptions/Notify';
  }

  nextSlide(type: string) {
    if (type == 'free') {
      this.currentFreeSlide =
        (this.currentFreeSlide + 1) % this.freeSlides.length;
    } else if (type == 'premium') {
      this.currentPremiumSlide =
        (this.currentPremiumSlide + 1) % this.premiumSlides.length;
    } else {
      this.currentRegulatedSlide =
        (this.currentRegulatedSlide + 1) % this.regulatedSlides.length;
    }
  }

  prevSlide(type: string) {
    if (type == 'free') {
      this.currentFreeSlide =
        (this.currentFreeSlide - 1 + this.freeSlides.length) %
        this.freeSlides.length;
    } else if (type == 'premium') {
      this.currentPremiumSlide =
        (this.currentPremiumSlide - 1 + this.premiumSlides.length) %
        this.premiumSlides.length;
    } else {
      this.currentRegulatedSlide =
        (this.currentRegulatedSlide - 1 + this.regulatedSlides.length) %
        this.regulatedSlides.length;
    }
  }

  goToSlide(index: number, type: string) {
    if (type == 'free') {
      this.currentFreeSlide = index;
    } else if (type == 'premium') {
      this.currentPremiumSlide = index;
    } else {
      this.currentRegulatedSlide = index;
    }
  }

  GetSubscriptions() {
  
    var user: any = this.authService.getCurrentUser();
    const userLoginDetails = JSON.parse(user);

    this.APIService.GetActiveSubscriptionByUserProfileId(
      userLoginDetails?.userProfileId
    ).subscribe(
      (response: any) => {

        this.subsArray = response.detailDescription.subscription;
switch (this.subsArray.package_id) {
  case 2: case 9:
    this.isSubscribedPremiumMonthly = true;
    break;
  case 3: case 7:
    this.isSubscriberRegulatedMonthly = true;
    break;
  case 4: case 5: case 10:
    this.isSubscribedPremiumAnnually = true;
    break;
  case 6: case 8:
    this.isSubscriberRegulatedAnnually = true;
    break;
}



      },
      (err) => {
        console.log('error: ', err);
      }
    );
  }

  CheckSubscriptionStatus(subscriptionPackageId: number, amount?: number) {
    var user: any = this.authService.getCurrentUser();
    const userLoginDetails = JSON.parse(user);

    this.APIService.GetSubscriptionByUserProfileId(
      userLoginDetails?.userProfileId
    ).subscribe(
      (response: any) => {
        // Initialize a flag to check if the subscriptionPackageId exists
        let packageExists = false;

        // responsede.forEach((element: any) => {
          if (response.detailDescription.subscription.package_id == subscriptionPackageId) {
            packageExists = true;
          }
        // });

      

        if (packageExists) {
          this.presentToast(
            'top',
            'You have already subscribed to this package!',
            'danger',
            'close'
          );
          this.router.navigate(['/subscription-package']);
          this.GetSubscriptions();
        } else if (response.detailDescription.subscription != null && !packageExists) {
          this.presentActionSheetSwitch();
          this.GetSubscriptions();
          this.selectedSubscriptionPackageId = subscriptionPackageId;
        } else {
          this.subscribe(amount!, subscriptionPackageId);
        }
      },
      (err) => {
        console.log('error: ', err);
      }
    );
  }

  openInAppBrowser(url: string) {
    this.browser = this.iab.create(url, '_blank', {
      location: 'no',
      hidden: 'no',
      hardwareback: 'yes',
      zoom: 'no',
      //hideurlbar: 'yes',
    });

    console.log('this.browser', this.browser);

    this.browser.on('loadstart').subscribe((event: any) => {
      console.log('loadstart - event', event);
      this.loadStartCallBack(event);
    });

    this.browser.on('loadstop').subscribe((event: any) => {
      this.loadStopCallBack(event);
    });

    this.browser.on('exit').subscribe((event: any) => {
      console.log('exit browswer activated');
      this.browser.close();
    });
  }

  loadStartCallBack(event: any) {
    /* Close InAppBrowser if loading the predefined close URL */

    console.log('loadstart- event', event);

    const url: string = (event?.url ?? '').toLowerCase();
    const returnUrl: string = (this.subsObj.returnUrl ?? '').toLowerCase();
    const cancelUrl: string = (this.subsObj.cancelUrl ?? '').toLowerCase();

    // PayFast may append query params, so avoid strict equality.
    if (returnUrl && url.startsWith(returnUrl)) {

      this.authService.setIsToReturnToSub(true);
      this.browser.close();
      // this.saveSub();
      this.loading = false;
      this.presentToastSub(
        'top',
        'Subscription Created!',
        'success',
        'checkmark'
      );
      this.router.navigate(['/landing-page']);
    } else if (cancelUrl && url.startsWith(cancelUrl)) {
      this.browser.close();
      this.loading = false;
      this.presentToast(
        'top',
        'Cancelled Adding of Subscription!',
        'danger',
        'checkmark'
      );
    }
  }

  loadStopCallBack(event: any) {
    console.log('loadstop - event', event);
  }

  subscribe(amount: number, packageId: number) {
    this.loading = true;

    var user: any = this.authService.getCurrentUser();
    const userLoginDetails = JSON.parse(user);

    if (packageId == 2 || packageId == 4 || packageId == 9 || packageId == 10) {
      this.subscriptionType = 'Premium';
    } else if (packageId == 3 || packageId == 5 || packageId == 7 || packageId == 8) {
      this.subscriptionType = 'Regulated';
    } else {
      this.subscriptionType = 'Free';
    }

    // Transaction details
    this.subsObj.m_payment_id = packageId.toString();
    this.subsObj.amount = Number(amount.toFixed(2));
    this.subsObj.item_name = this.subscriptionType;
    this.subsObj.userId = userLoginDetails?.userProfileId;
    this.subsObj.item_description = this.subscriptionType;
    // Customer details
    this.subsObj.name_first = userLoginDetails?.aspUserName;
    this.subsObj.name_last = userLoginDetails?.aspUserName;
    this.subsObj.email_address = userLoginDetails?.aspUserEmail;
    // Transaction options
    this.subsObj.confirmation_email = userLoginDetails?.aspUserEmail;

    // Subscriptions
    // subscription_type
    // billing_date
    // frequency
    // cycles
    this.subsObj.recurring_amount = Number(amount.toFixed(2));
    this.subsObj.subscription_amount = Number(amount.toFixed(2));
    this.subsObj.package_id = packageId;
    this.subsObj.package_name =
      this.selectedPaymentType + ' ' + this.subscriptionType;
    this.subsObj.subscription_type = this.subscriptionType;

    console.log('subO: ', this.subsObj);


    this.APIService.paySubscription(this.subsObj).subscribe(
      (payRes: any) => {
        console.log('url: ', payRes.url);
        console.log('response-paypal: ', payRes);
        this.openInAppBrowser(payRes.url);
      },
      (err) => {
        console.log('error: ', err);
        this.loading = false;
      }
    );
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  provideFeedback(subscriptionPackageId: number, amount?: number) {

    console.log("subscriptionPackageId", subscriptionPackageId)
    if (!this.authService.getIsLoggedIn()) {
      const redirectUrl = `/subscription-package?id=${subscriptionPackageId}`;
      this.authService.setRedirectUrl(redirectUrl);
      this.authService.setIsFromSubscription(true);
      this.router.navigate(['/login'], { queryParams: { redirectUrl } });

      this.selectedSubscriptionPackageAmount = amount;

      // Create a promise that resolves when the user logs in
      const loginPromise = new Promise<void>((resolve, reject) => {
        const subscription = this.authService.loginEvent.subscribe({
          next: (loggedIn: boolean) => {
            if (loggedIn) {
              console.log('Login status changed:', loggedIn);
              // Once logged in, resolve the promise
              resolve();
              // Clean up subscription
              subscription.unsubscribe();
            }
          },
          error: (error: any) => {
            console.error(
              'Error occurred during login event subscription:',
              error
            );
            // Reject the promise if an error occurs
            reject(error);
          },
        });
      });

      // Once the user logs in, proceed with subscription
      loginPromise
        .then(() => {})
        .catch((error) => {
          // Handle error appropriately
        });
    } else {
      // If already logged in, directly set the selectedSubscriptionPackageId
      this.selectedSubscriptionPackageId = subscriptionPackageId;
      this.selectedSubscriptionPackageAmount = amount;

      // Implement a check for existing one
      this.CheckSubscriptionStatus(subscriptionPackageId, amount!);
    }
  }

  saveSub() {
    var oneYearOrMonthFromNow = new Date();
    // var oneMonthFromNow = new Date();

    var user: any = this.authService.getCurrentUser();
    const userLoginDetails = JSON.parse(user);
    this.updateSub.package_price = this.subsObj.recurring_amount;
    this.updateSub.package_id = Number(this.subsObj.m_payment_id);
    this.updateSub.package_name =
      this.selectedPaymentType + ' ' + this.subsObj.item_name;
    this.updateSub.subscriptionId = 0;
    this.updateSub.subscription_status = 'Active';
    this.updateSub.subscription_token = this.token;
    this.updateSub.start_date = new Date(Date.now());

    if (this.selectedPaymentType === 'monthly') {
      this.updateSub.end_date = new Date(
        oneYearOrMonthFromNow.setMonth(oneYearOrMonthFromNow.getMonth() + 1)
      );
      this.updateSub.subscription_duration = Number(
        this.daysBtnDates(this.updateSub.start_date, this.updateSub.end_date)
      );
    } else {
      this.updateSub.end_date = new Date(
        oneYearOrMonthFromNow.setFullYear(
          oneYearOrMonthFromNow.getFullYear() + 1
        )
      );
      this.updateSub.subscription_duration = Number(
        this.daysBtnDates(this.updateSub.start_date, this.updateSub.end_date)
      );
    }

    this.updateSub.userprofileid = userLoginDetails?.userProfileId;

  

    console.log('updateSub', this.updateSub);


    this.APIService.PostInsertSubscription(this.updateSub).subscribe(
      (data: any) => {
        console.log('postSub: ', data);
        this.router.navigate(['/landing-page']);

        if (this.isSubscriptionSwitch) {
          this.updateSwitchedSub();
        } else {
          this.presentToastSub(
            'top',
            'Subscription Added!',
            'success',
            'checkmark'
          );
          this.GetSubscriptions();
        }
      },
      (err) => {
        console.log('postSub err: ', err);
      }
    );
  }

  CancelSubscription(subscriptionId: number) {
    this.cancelSubscriptionId = subscriptionId;
    this.presentActionSheetCancel();
  }

  CancelFreeSubscription() {
    this.presentActionSheetCancelFreeSub();
  }

  cancelSub() {
    this.loading = true;

    var user: any = this.authService.getCurrentUser();
    const userLoginDetails = JSON.parse(user);

    console.log(this.subsArray)



    this.APIService.CancelSubscription(
      this.subsArray.subscriptionId
    ).subscribe(
      (data: any) => {
        console.log('cancelSub: ', data);
        this.router.navigate(['/landing-page']);
        this.authService.setIsToReturnToSub(true);

        this.presentToast(
          'top',
          'Subscription Cancelled!',
          'success',
          'checkmark'
        );
        this.GetSubscriptions();

        this.loading = false;
      },
      (err) => {
        console.log('cancelSub err: ', err);
        this.loading = false;
      }
    );
  }

  switchSub() {
    this.isSubscriptionSwitch = true;
    this.subscribe(
      this.selectedSubscriptionPackageAmount!,
      this.selectedSubscriptionPackageId!
    );
  }

  updateSwitchedSub() {
    this.subsArray[0].subscription_status = 'Cancelled';

    this.isSubscriptionSwitch = false;

    this.APIService.PostInsertSubscription(this.subsArray[0]).subscribe(
      (data: any) => {
        console.log('updateSub: ', data);
        this.router.navigate(['/landing-page']);

        this.presentToastSub('top', 'Subscription Changed!', 'success', 'sync');
        this.GetSubscriptions();
      },
      (err) => {
        console.log('updateSub err: ', err);
      }
    );
  }

  filterSubscriptionsById(subscriptionId: number) {
    return this.subsArray.filter(
      (subscription: any) => subscription.subscriptionId === subscriptionId
    );
  }

  async presentActionSheetCancel() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Cancel Subscription!',
      subHeader: `Are you sure you want to Unsubscribe from the selected subscription?`,
      buttons: this.actionSheetButtonsCancel,
      cssClass: 'my-custom-class',
    });
    await actionSheet.present();
  }

  async presentActionSheetCancelFreeSub() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Cancel Subscription!',
      subHeader: `This is a free subscriptions and cannot be unsubribed!`,
      buttons: this.actionSheetButtonsCancelFreeSub,
      cssClass: 'my-custom-class',
    });
    await actionSheet.present();
  }

  async presentActionSheetSwitch() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Another Subscription Exists!',
      subHeader: `Are you sure you want to change the Subscription?`,
      buttons: this.actionSheetButtonsSwitch,
      cssClass: 'my-custom-class',
    });
    await actionSheet.present();
  }

  async presentToast(
    position: 'top' | 'middle' | 'bottom',
    message: string,
    color: string,
    icon: string
  ) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: position,
      color: color,
      icon: icon,
      cssClass: 'custom-toast',
      swipeGesture: 'vertical',
    });

    await toast.present();
  }

  async presentToastSub(
    position: 'top' | 'middle' | 'bottom',
    message: string,
    color: string,
    icon: string
  ) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: position,
      color: color,
      icon: icon,
      cssClass: 'custom-toast',
      swipeGesture: 'vertical',
      buttons: [
        {
          side: 'end',
          text: 'Go to Subscription',
          handler: () => {
            this.router.navigate(['/subscription-package']);
          },
        },
      ],
    });

    await toast.present();
  }

  handleAction(action: string) {
    switch (action) {
      case 'delete':
        this.cancelSub();
        console.log('Delete action triggered');
        break;
      case 'cancel':
        console.log('Cancel action triggered');
        break;
      case 'subscribe':
        this.switchSub();
        console.log('Subscribe action triggered');
        break;
      default:
        console.log('Unknown action');
    }
  }

  selectPaymentType(type: string) {
    this.selectedPaymentType = type;

    if (type === 'monthly') {
      this.freeSubscriptionAmount = 0;
      this.premiumSubscriptionAmount = 180;
      this.regulatedSubscriptionAmount = 380;
      this.freeSubscriptionId = 1;
      this.premiumSubscriptionId = 2;
      this.regulatedSubscriptionId = 3;
    } else {
      this.freeSubscriptionAmount = 0;
      this.premiumSubscriptionAmount = 2160;
      this.regulatedSubscriptionAmount = 4560;
      this.freeSubscriptionId = 4;
      this.premiumSubscriptionId = 5;
      this.regulatedSubscriptionId = 6;
    }
    
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

  selectFreeService(service: string) {
    this.selectedFreeService = service;

    for (let key in this.dropdownVisible) {
      this.dropdownVisible[key] = false;
    }
  }

  selectPremiumService(service: string) {
    this.selectedPremiumService = service;

    for (let key in this.dropdownVisible) {
      this.dropdownVisible[key] = false;
    }
  }

  selectRegulatedService(service: string) {
    this.selectedRegulatedService = service;

    for (let key in this.dropdownVisible) {
      this.dropdownVisible[key] = false;
    }
  }

  daysBtnDates(date1: any, date2: any) {
    let Difference_In_Time =
      new Date(date2).getTime() - new Date(date1).getTime();

    // Calculating the no. of days between
    // two dates
    let Difference_In_Days = Math.round(
      Difference_In_Time / (1000 * 3600 * 24)
    );

    return Difference_In_Days;
  }

  NavigateToLandingPage() {
    this.router.navigate(['/landing-page']);
    this.authService.setIsFromSubscription(false);
  }
  


}
