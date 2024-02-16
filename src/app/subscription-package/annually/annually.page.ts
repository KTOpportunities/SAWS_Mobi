import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-annually',
  templateUrl: './annually.page.html',
  styleUrls: ['./annually.page.scss'],
})
export class AnnuallyPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

}
