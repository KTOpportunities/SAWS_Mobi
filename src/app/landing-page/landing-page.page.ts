import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { APIService } from '../services/apis.service';
import {} from '@ionic/angular';
import { SwiperModule } from 'swiper/types';
import { Swiper } from 'swiper';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


import 'swiper/css';

export interface Advertisement {
  imageUrl: string;
  link: string;
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
  advertisement: Advertisement | null = null;
  advertisements: Advertisement[] = [];
  currentAdvertisementIndex: number = 0;
  //This is a union type. It means that currentAdvertisement can hold either an object of type Advertisement or the value null.
  currentAdvertisement: Advertisement | null = null; 

  swiperConfig: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: APIService,
    private sanitizer: DomSanitizer,

  ) {}

  ngOnInit() {
    // this.loadAdvertisement();
    //This method is called to load all the advertisements.
    this.loadAllAdvertisements(); 
    setInterval(() => {
      // This method is responsible for rotating the advertisements
   
      this.rotateAdvertisements();
    }, 3000); 
  }
  rotateAdvertisements() {
       // It checks if there are advertisements available 
    if (this.advertisements.length > 0)
     {
      // if so, it updates the currentAdvertisement to the next advertisement in the array
      this.currentAdvertisementIndex = (this.currentAdvertisementIndex + 1) % this.advertisements.length;
      // is used to keep track of which advertisement is currently being displayed.
      this.currentAdvertisement = this.advertisements[this.currentAdvertisementIndex];
    }
    if (this.currentAdvertisement) {
      console.log('Current advertisement URL', this.currentAdvertisement.link);
    }

  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
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

// This method fetches all advertisements 
loadAllAdvertisements() {
  // is called to make an HTTP request to fetch advertisements.
  this.apiService.getAllAdverts().subscribe( //This allows us to react to the data when it arrives or handle any errors.
    (data: any[]) => {
      console.log('getAllAdverts', data);
      this.advertisements = data.map(ad => {
        // prevent security vulnerabilities, creating a safe URL for the image.
        const imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(ad.file_url);
        return { imageUrl, link: ad.advert_url } as Advertisement;
      });
      console.log('advertisements', this.advertisements);
      this.initializeSwiper();
    },
    (error: any) => {
      console.error('Error fetching all advertisements:', error);
    }
  );
}



initializeSwiper() {
  console.log('Initializing Swiper');
  if (this.advertisements.length > 0 && this.swiperElement) {
    console.log('Creating Swiper instance');
    this.swiper = new Swiper(this.swiperElement.nativeElement, {
      direction: 'vertical',
      loop: false, // Disable looping
      autoplay: {
        delay: 3000, // Delay between slides (in milliseconds)
        disableOnInteraction: false, // Enable continuous autoplay
      },
      navigation: false, // Disable navigation buttons
      allowTouchMove: false, // Disable user interaction
    });
  } else {
    console.log('Advertisements array is empty or ');
  }
}





}


 
  
 
  

