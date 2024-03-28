import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { APIService } from './../../services/apis.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

export interface textFile {
  foldername: string;
  filename: string;
  lastmodified: string;
  filetextcontent: string;
}
@Component({
  selector: 'app-advisories',
  templateUrl: './advisories.component.html',
  styleUrls: ['./advisories.component.scss'],
})
export class AdvisoriesComponent implements OnInit {
  isLoading: boolean = true;
  AdvisoriesList: any = [];
  VolcanoList: any = [];
  CycloneList: any = [];
  swxcList: any = [];
  filter: any;
  filter2: any;
  constructor(
    private api: APIService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}
  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event: any): void {
    debugger;
    this.scrollBuytton();
  }

  ngOnInit() {
    var Volcanos: any = [];
    var Cyclones: any = [];
    var SWX: any = [];
    this.api.GetSourceTextFolderFiles('alerts').subscribe((Response) => {
      Response.forEach((element: any) => {
        element.Id = element.filetextcontent.split('\n')[2];
        if (element.Id.split(' ')[0] == 'VA') {
          var vwValue = element.filetextcontent.split('\n')[5];
          element.heading = vwValue;
          vwValue = vwValue.split('VOLCANO: ')[1];
          if (vwValue == undefined) {
            vwValue = element.filetextcontent.split('\n')[5];
          }
          var obj = {
            value: element.filetextcontent.split('\n')[0],
            viewValue: vwValue,
          };
          this.VolcanoList.push(obj);
          element.Id = element.filetextcontent.split('\n')[0];
        }
        if (element.Id.split(' ')[0] == 'TC') {
          debugger;
          var vwValue = element.filetextcontent.split('\n')[5];
          element.heading = vwValue;
          vwValue = vwValue.split('TC:')[1].trim();
          var obj = {
            value: element.filetextcontent.split('\n')[0],
            viewValue: vwValue,
          };
          this.CycloneList.push(obj);
          element.Id = element.filetextcontent.split('\n')[0];
        }
      });
      this.AdvisoriesList = Response;
      console.log('Response ', this.AdvisoriesList);
      debugger;
      this.isLoading = false;
      this.spinner.hide();
    });

    document.addEventListener('scroll', () => {
      debugger;
      var Topbutton = document.getElementById('btntotop');
      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        Topbutton!.style.display = 'block';
      } else {
        Topbutton!.style.display = 'none';
      }
    });
  }

  ScrollToFilter(event: any) {
    debugger;
    var element = document.getElementById(event.target.value);
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  ScrollToTop(value: any) {
    debugger;
    var element = document.getElementById(value);
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollBuytton() {
    debugger;
    let buttoTop = document.getElementById('btntotop');
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      buttoTop!.style.display = 'block';
    } else {
      buttoTop!.style.display = 'none';
    }
  }

  forecastPage() {
    window.history.back();
    // this.router.navigate(['/forecast']);
  }
}
