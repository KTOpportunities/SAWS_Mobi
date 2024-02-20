import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.page.html',
  styleUrls: ['../../subscription-package/subscription-package.page.scss'],
})
export class MessageListPage implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  providerfeedback() {    
    this.router.navigate(['/provide-feedback']);

  
  }

  home() {
    
    this.router.navigate(['../../landing-page']);
  }

}
