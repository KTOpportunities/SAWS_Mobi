import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}
  home() {
    // Check if the current route is the login page
    this.router.navigate(['/landing-page']);
  }
}
