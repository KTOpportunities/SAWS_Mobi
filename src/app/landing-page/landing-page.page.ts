import { Component, OnInit, ViewChild,ElementRef  } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { APIService } from '../services/apis.service';
import Swiper from 'swiper';
import 'swiper/css';




export interface Advertisement {
  imageUrl: string;
  link: string;
  description: string;
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.page.html',
  styleUrls: ['./landing-page.page.scss'],
})
export class LandingPage implements OnInit {

  @ViewChild('swiper', { static: true }) swiperElement?: ElementRef;
swiperRef: any;
swiper?: Swiper;
showSwiper: boolean = false; 
advertisement: Advertisement | null = null;
// swiperComponent: SwiperComponent;

  // advertisement:any;
swiperConfig: any;
  swiperComponent: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: APIService
  ) {}
  swiperReady() {
    this.swiper = this.swiperRef.nativeElement.swiper;
  }
  ngOnInit() {

    this.loadAdvertisement();
    this.loadAllAdvertisements();
    this.startAutoSlide();
    this.loadfileAdvertisement();
    this.initializeSwiper();

      // Initialize Swiper with autoplay and specified delay
      if (this.swiperElement) {
        this.swiperConfig = new Swiper(this.swiperElement.nativeElement, {
          direction: 'vertical',
          loop: true,
          autoplay: {
            delay: 5000, // Adjust the delay as needed (in milliseconds)
            disableOnInteraction: false, // Enable auto-sliding even when user interacts with swiper
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          allowTouchMove: false, // Disable user interaction
        });
      } else {
        console.error("Swiper element is undefined.");
      }
    }
    startAutoSlide() {
      setInterval(() => {
        if (this.swiper) {
          this.swiper.slideNext(); // Programmatically slide to the next ad
        }
      }, 2000);
    }
      

  
   
  
 

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
  toggleSwiper() {
    this.showSwiper = !this.showSwiper;
  }

  forecastPage() {
    this.router.navigate(['/forecast']);
  }

  InternationalPage() {
    this.router.navigate(['/international']);
  }
 

 
  
  aerosportPage() {
    if (this.authService.getIsLoggedIn()) {
      this.router.navigate(['/aero-sport']);
    } else {
      this.authService.setRedirectUrl('/aero-sport');
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
  // swiperSlideChange(e: any) {
  //   console.log('changed:', e );
  // }

  observPage() {
    this.router.navigate(['/observation']);
  }

  FlightBriefing() {
    if (this.authService.getIsLoggedIn()) {
      this.router.navigate(['/flight-briefing']);
    } else {
      this.authService.setRedirectUrl('/flight-briefing');
      this.router.navigate(['/login']);
    }
  }

  domesticPage() {
    if (this.authService.getIsLoggedIn()) {
      this.router.navigate(['/domestic']);
    } else {
      this.authService.setRedirectUrl('/domestic');
      this.router.navigate(['/login']);
    }
  }

  loadAdvertisement() {
    this.apiService.getAdvertByAdvertId(9).subscribe(
      (data: Advertisement) => {
        console.log('Advertisement data:', data);
        // Ensure that the data contains the necessary properties
        if (data && data.imageUrl) {
          // Type assertion to Advertisement interface
          this.advertisement = data ;
        }
      },
      (error: any) => {
        console.error('Error fetching advertisement:', error);
      }
    );
  }

  loadAllAdvertisements() {
    this.apiService.getAllAdverts().subscribe(
      (data: any) => {
        console.log('All advertisements:', data);
        this.advertisement = data;
        // Handle the response containing all advertisements
      },
      (error: any) => {
        console.error('Error fetching all advertisements:', error);
      }
    );
  }

  loadfileAdvertisement(): void {
    this.apiService.getDocAdvertFileById(7).subscribe(
      (response: Blob) => {
        console.log('Advertisement image response:', response);
        const url = window.URL.createObjectURL(response);
        // Ensure that advertisement is properly assigned
        this.advertisement = { imageUrl: url } as Advertisement;
      },
      (error: any) => {
        console.error('Error fetching advertisement image:', error);
      }
    );
  }
   initializeSwiper() {
    if (this.swiperElement) {
      this.swiper = new Swiper(this.swiperElement.nativeElement, {
        direction: 'vertical',
        loop: true,
        autoplay: {
          delay: 2000, // Adjust the delay as needed (in milliseconds)
          disableOnInteraction: false, // Enable auto-sliding even when user interacts with swiper
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
       allowTouchMove: false,
      });
    }
  }


}
