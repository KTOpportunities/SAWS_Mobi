import { Component, OnInit,ElementRef,
  HostListener, } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-observation',
  templateUrl: './observation.page.html',
  styleUrls: ['./observation.page.scss'],
})
export class ObservationPage implements OnInit {
  
  isLogged: boolean = false;
  isMetar:boolean = true;
  isRanderImages:boolean = false;
  // iscolorcoded:boolean = true;
  iscodeTafs:boolean = false;

  webcamActive: boolean = false;
  constructor(private router: Router, private authService: AuthService, private elRef: ElementRef) {}
  ngOnInit() {}
  
  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
  metar () {
    this.isMetar = false;
    this.isRanderImages = true
  }

  observatPage() {
    this.isMetar = true;
    this.isRanderImages = false
    this.iscodeTafs = false
  }

  colorcoded () {
  this.isMetar = false;
  this.iscodeTafs = true
  }

  observPage() {
    this.router.navigate(['/landing-page']);
  }
  observMetarPage() {
    // this.router.navigate(['/news']);
    this.router.navigate(['/web-cam']);
  }
}
