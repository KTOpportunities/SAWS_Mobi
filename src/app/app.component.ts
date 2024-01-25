import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'ABOUT', url: '/folder/inbox' },
    { title: 'HOME', url: '/folder/outbox' },
    { title: 'QUERIES', url: '/folder/favorites' },
    { title: 'DOMESTIC', url: '/folder/archived' },
    { title: 'FORECAST', url: '/folder/trash' },
    { title: 'AEROSPORT', url: '/folder/spam' },
    { title: 'OBSERVATION', url: '/folder/spam' },
    { title: 'INTERNATIONAL', url: '/folder/spam' },
    { title: 'FLIGHT BRIEFING', url: '/folder/spam', icon: 'warning' },
  ];
  public LOGOUT = ['LOGOUT'];
  constructor(private router: Router,) {}
  logout(){
    this.router.navigate(['/login']);
  }
}
