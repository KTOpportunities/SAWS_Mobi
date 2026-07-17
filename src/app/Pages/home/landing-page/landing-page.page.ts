import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { SwiperModule } from 'swiper/types';
import { Swiper } from 'swiper';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AuthService } from 'src/app/services/auth.service';
import { APIService } from 'src/app/services/apis.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

export interface Advertisement {
  imageUrl: string;
  link: string;
  advertId: number;
  description: string;
  isActive?: boolean;
}
interface AdvertResponse {
  Value: {
    Status: string;
    Message: string;
    DetailDescription: {
      DocAdverts: {
        Id: number;
        URL: string;
      }[];
    };
  };
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.page.html',
  styleUrls: ['./landing-page.page.scss'],
})
export class LandingPage implements OnInit {
  @ViewChild('swiper', { static: true }) swiperElement?: ElementRef;
  swiper?: Swiper;
  advertisements: Advertisement[] = [];
  currentAdvertisementIndex: number = 0;
  currentAdvertisement: Advertisement | null = null;

  swiperConfig: any;
  browser: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: APIService,
    private sanitizer: DomSanitizer,
    private toastController: ToastController,
    private iab: InAppBrowser
  ) {}

  ionViewWillEnter() {
    this.UpdateSubscriptionStatus();
  }

  ngOnInit() {
    this.loadAllAdvertisements();

    this.rotateAdvertisements();

    setInterval(() => {
      this.rotateAdvertisements();
    }, 6000);
  }

  addAdvertClick(body: any) {
    console.log('Success:', body);
    this.apiService.PostInsertAdvertClick(body).subscribe(
      (data: any) => {},
      (err) => {}
    );
  }

  rotateAdvertisements() {
    if (this.advertisements.length > 0) {
      this.currentAdvertisementIndex =
        (this.currentAdvertisementIndex + 1) % this.advertisements.length;
      this.currentAdvertisement =
        this.advertisements[this.currentAdvertisementIndex];
    }
    if (this.currentAdvertisement) {
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  get isFreeSubscription(): boolean {
    return this.authService.getIsFreeSubscription();
  }

  UpdateSubscriptionStatus() {
    var user: any = this.authService.getCurrentUser();
    const userLoginDetails = JSON.parse(user);

    if (this.isLoggedIn) {
      this.apiService
        .GetActiveSubscriptionByUserProfileId(userLoginDetails?.userProfileId)
        .subscribe(
          (data: any) => {
            if (data.detailDescription.subscription.isactive) {
              this.authService.setSubscriptionStatus(
                data.detailDescription.subscription.package_name
              );
              
               console.log('Subscription package stored in AuthService:',  data.detailDescription.subscription.package_name);
            } else {
              this.authService.setSubscriptionStatus('');
            }
          },
          (err) => {
            console.log('postSub err: ', err);
          }
        );
    }
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
  }

  async presentToast(
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

  forecastPage() {
    this.router.navigate(['/forecast']);
  }

  InternationalPage() {
    this.router.navigate(['/international']);
  }

  aerosportPage() {
    if (this.isLoggedIn && !this.isFreeSubscription) {
      this.router.navigate(['/aero-sport']);
    } else if (this.isLoggedIn && this.isFreeSubscription) {
      this.presentToast(
        'top',
        'Subscription is required to access Service!',
        'danger',
        'close'
      );
    } else {
      this.authService.setRedirectUrl('/aero-sport');
      this.router.navigate(['/login']);
    }
  }

  observPage() {
    this.router.navigate(['/observation']);
  }

  FlightBriefing() {
    if (this.isLoggedIn && !this.isFreeSubscription) {
      this.router.navigate(['/flight-briefing']);
    } else if (this.isLoggedIn && this.isFreeSubscription) {
      this.presentToast(
        'top',
        'Subscription is required to access Service!',
        'danger',
        'close'
      );
    } else {
      this.authService.setRedirectUrl('/flight-briefing');
      this.router.navigate(['/login']);
    }
  }

  domesticPage() {
    if (this.isLoggedIn && !this.isFreeSubscription) {
      this.router.navigate(['/domestic']);
    } else if (this.isLoggedIn && this.isFreeSubscription) {
      this.presentToast(
        'top',
        'Subscription is required to access Service!',
        'danger',
        'close'
      );
    } else {
      this.authService.setRedirectUrl('/domestic');
      this.router.navigate(['/login']);
    }
  }

  goBack() {
    if (this.swiper) {
      this.swiper.slidePrev();
    }
  }

  goNext() {
    if (this.swiper) {
      this.swiper.slideNext();
    }
  }
//  GetPagedAllAdverts(pageNumber: any, pageSize: any) {
//     return this.http.get<any>(
//       environment.serverAPI + `v1/Adverts/GetPagedAllAdverts?pageNumber=${pageNumber}&pageSize=${pageSize}`,
//     );
//   }
  loadAllAdvertisements() {
    debugger
    this.apiService.getAllAdverts().subscribe(
      (data: any[]) => {
        this.advertisements = data.map((ad) => {
          const imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            'data:image/png;base64,' + ad.file_url
          );

          const advertUrl = this.ensureValidURL(ad.advert_url);

          const advertId = ad.advertId;

          return { imageUrl, link: advertUrl, advertId } as Advertisement;
        });

        if (this.advertisements.length > 0) {
          this.currentAdvertisement = this.advertisements[0];
        }

        this.initializeSwiper();
      },
      (error: any) => {
        console.error('Error fetching all advertisements:', error);
      }
    );
  }

  ensureValidURL(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    return url;
  }

  launchAdvertLink(advertUrl: string, advertId: number) {
    // window.open(advertUrl, "_blank");
    this.openInAppBrowser(advertUrl);

    const body = {
      advertClickId: 0,
      advertId: advertId,
    };

    this.addAdvertClick(body);
  }

  initializeSwiper() {
    if (this.advertisements.length > 0 && this.swiperElement) {
      this.swiper = new Swiper(this.swiperElement.nativeElement, {
        direction: 'vertical',
        loop: true,
        autoplay: {
          delay: 10000,
          disableOnInteraction: false,
        },
        navigation: false,
        allowTouchMove: true,
      });
    }
  }
}
