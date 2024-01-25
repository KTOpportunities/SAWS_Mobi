import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.page.html',
  styleUrls: ['./forecast.page.scss'],
})
export class ForecastPage implements OnInit {

  constructor(private router: Router,) { }

  ngOnInit() {
  }
  forecastPage(){
    this.router.navigate(['/folder/inbox']);
  }
}
