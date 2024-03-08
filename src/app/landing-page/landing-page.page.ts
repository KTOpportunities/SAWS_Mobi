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
  this.apiService.getAllAdverts().subscribe(
    (data: any[]) => {
      debugger;
      console.log('getAllAdverts', data);
      // this.totalAdvertisements = data.length;
      data.forEach(ad => {
        debugger;
        console.log('Advertisement :', ad); // Log the advertisement ID
        // this.GetAdvertByAdvertId(ad.advertId);
        let image = this.sanitizer.bypassSecurityTrustResourceUrl(
          'data:image/jpg;base64,' + ad.base64_file_url
        );
         // Use the sanitized URL
         const advertisement = { imageUrl:image, link: ad.advert_url} as Advertisement; 
         this.advertisements.push(advertisement);
         // Update Swiper when new advertisement is added
         if (this.swiper) {
           this.swiper.update(); 
         }
         
      });
     console.log('advertisement',this.advertisement);

      this.initializeSwiper();
    },
    (error: any) => {
      console.error('Error fetching all advertisements:', error);
    }
  );
}

// This method fetches the details of a specific advertisement by its ID using apiService

GetAdvertByAdvertId(advertId: number) {
  this.apiService.GetAdvertByAdvertId(advertId).subscribe(
    (response: AdvertResponse) => {
      console.log('GetAdvertByAdvertId', response);
      if (response && response.Value && response.Value.DetailDescription && response.Value.DetailDescription.DocAdverts.length > 0) {
        const docAdvertId = response.Value.DetailDescription.DocAdverts[0].Id;
        this.loadfileAdvertisement(docAdvertId);
      } else {
        console.error('Invalid advertisement response:', response);
      }
    },
    (error: any) => {
      console.error('Error fetching advertisement image for ID', advertId, ':', error);
    }
  );
}



// This method fetches the actual advertisement file
loadfileAdvertisement(Id: any) {
  // method of the apiService, passing the Id parameter
  this.apiService.getDocAdvertFileById(Id).subscribe(
    // (response This is the success callback function of the subscribe())
    // response parameter contains the data returned by the server
    (response) => {
      console.log('Display Img', response);
      // This URL represents the file content as a Blob URL, 
      const url = window.URL.createObjectURL(response);
      // Sanitize URL
      // This step is crucial for preventing potential security as it marks the URL as safe  
      const safeUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url); 
      // Use the sanitized URL
      const advertisement = { imageUrl: safeUrl } as Advertisement; 
      this.advertisements.push(advertisement);
      // Update Swiper when new advertisement is added
      if (this.swiper) {
        this.swiper.update(); 
      }
    },
    (error: any) => {
      console.error('Error fetching advertisement image:', error);
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


 
  
 
  

