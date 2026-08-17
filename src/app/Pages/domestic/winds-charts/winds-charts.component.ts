import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ImageViewrPage } from '../../image-viewr/image-viewr.page';
import { ModalController } from '@ionic/angular';
import { ImageModalPage } from '../../image-modal/image-modal.page';

@Component({
  selector: 'app-winds-charts',
  templateUrl: './winds-charts.component.html',
  styleUrls: ['./../domestic.page.scss'], // Adjust the path if needed
})
export class WindsChartsComponent implements OnInit {

  isLogged: boolean = false;
  loading: boolean = false;
  chartsArray: any[] = []; // Ensure this is an array
  BlockWinds: any[] = [];
  blockWindsWH: any[] = [];
blockWindsWL: any[] = [];
 blockWindsZFL: any[] = [];
  sevenDigitNumbers: number[] = []; // Explicitly declare the type of this array
  fileBaseUrl: SafeResourceUrl;
  ImageArray: any = [];
  chart = [
    // Sample data
    { title: 'Low level (surface to FL180)', filename: 'chart1.png' },
    { title: 'High level (above FL180)', filename: 'chart2.png' },
    // Add more chart data as needed
  ];

  blockFormats = [
    { format: 'FL010 to FL240', numbers: [12, 18, 24, 30, 36, 42, 48] },
    { format: 'FL210 to FL450', numbers: [12, 18, 24, 30, 36, 42, 48] },
    { format: 'FL010 to FL150', numbers: [12, 18, 24, 30, 36, 42, 48] },
    { format: 'FL150 to FL450', numbers: [12, 18, 24, 30, 36, 42, 48] },
    { format: 'All level scroll', numbers: [12, 18, 24, 30, 36, 42, 48] }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private APIService: APIService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private moodalCtrl: ModalController,
  ) {
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  ngOnInit() {
    this.loading = true;
    this.generateSevenDigitNumbers(7);
    this.fetchBlockWindChartImages();
     this.fetchWindChartImage();
    if (!this.authService.getIsLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  generateSevenDigitNumbers(count: number) {
    this.sevenDigitNumbers = [];
    for (let i = 0; i < count; i++) {
      const number = Math.floor(1000000 + Math.random() * 9000000);
      this.sevenDigitNumbers.push(number);
    }
    this.sevenDigitNumbers.sort((a, b) => a - b);
    console.log('Generated and Sorted Seven Digit Numbers:', this.sevenDigitNumbers);
  }
  
  fetchBlockWindChartImages() {
    this.APIService.GetSourceAviationFolderFilesList('winds/blockwinds').subscribe(
      (data: any[]) => {
        console.log('API Response:', data);

        // Debug: Ensure 'data' is an array and contains objects with 'filename'
        if (!Array.isArray(data)) {
          console.error('API response is not an array:', data);
          this.loading = false;
          return;
        }

        console.log('Seven Digit Numbers:', this.sevenDigitNumbers);

        if (data && data.length > 0) {
          // Check if 'filename' exists and contains expected substrings
          const filteredData = data.filter(item => item.filename);
        
          this.BlockWinds = data

          console.log('Charts Array:', this.BlockWinds);
          this.blockWindsWH = this.BlockWinds.filter(item => item.filename.includes('WH'));
          this.blockWindsWL = this.BlockWinds.filter(item => item.filename.includes('WL'));
         
     
        } else {
          console.warn('No valid data found in API response.');
        }

        this.loading = false;
      },
      (error) => {
        console.error('Error fetching wind chart images:', error);
        this.loading = false;
      }
    );
  }
  
   fetchWindChartImage() {
    this.APIService.GetSourceAviationFolderFilesList('winds/vectorwinds').subscribe(
      (data: any[]) => {
        console.log('API Response:', data);

        // Debug: Ensure 'data' is an array and contains objects with 'filename'
        if (!Array.isArray(data)) {
          console.error('API response is not an array:', data);
          this.loading = false;
          return;
        }

        console.log('Seven Digit Numbers:', this.sevenDigitNumbers);

     
          this.chartsArray = data;
         this.blockWindsZFL = this.BlockWinds.filter(item => item.filename.includes('ZFL'));

          
          console.log('Charts Array:', this.blockWindsZFL);
      

        this.loading = false;
      },
      (error) => {
        console.error('Error fetching wind chart images:', error);
        this.loading = false;
      }
    );
  }
  getChartFormat(filename: string): string {
    if (filename.includes('30')) return '30';
    if (filename.includes('36')) return '36';
    if (filename.includes('42')) return '42';
    if (filename.includes('48')) return '48';
    return 'Unknown Format';
  }

  removefile(filename: string): string {
    const match = filename.match(/\d+/);
    return match ? match[0] : '';
  }

  openImageViewer(item: any) {
    console.log('Opening', item);
    const folderName = item.foldername;
    const fileName = item.filename;

    if (folderName  && fileName) {
      this.loading = true;

      this.fetchSecondAPI(folderName, fileName)
        .then((filecontent) => {
          this.loading = false;

          const dialogConfig = new MatDialogConfig();
          dialogConfig.autoFocus = true;
          dialogConfig.disableClose = true;
          dialogConfig.width = '80%';
          dialogConfig.height = '80%';
          dialogConfig.data = { filecontent };

          const dialogRef = this.dialog.open(ImageViewrPage, dialogConfig);

          dialogRef.afterClosed().subscribe(() => {
            this.loading = false;
          });
        })
        .catch((error) => {
          console.error('Error fetching file content:', error);
          this.loading = false;
        });
    } else {
      console.error('Folder name or file name is undefined.');
    }
  }

  fetchSecondAPI(folderName: string, fileName: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.APIService.GetAviationFile(folderName, fileName).subscribe(
        (response) => {
          const filecontent = response.filecontent;
          console.log('File Text Content:', filecontent);
          resolve(filecontent);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  NavigateToDomestic() {
    this.router.navigate(['/domestic']);
  }

  async ImageViewer(imgs: any) {
    console.log('The img:', imgs);

    const modal = await this.moodalCtrl.create({
      component: ImageModalPage,
      componentProps: {
        imgs, // image link passed on click event
      },
      cssClass: 'transparent-modal',
    });
    modal.present();
  }

  ImagesArray(item: any, type: any[]) {
    console.log('ITEM:', item, ' TYPE:', type);

    // Ensure you are checking the filename property of each object
    let ImageArray = type.filter((x) => x.filename.includes(item.filename));

    console.log('Image arrays:', ImageArray);
 
    this.ConvertImagesArray(ImageArray,item.foldername);
  }
  ConvertImagesArray(ImageArray: any[], foldername: any) {
    this.ImageArray = [];
    console.log('IMAGE ARRAY', ImageArray);
    ImageArray.forEach((element) => {
      this.APIService.GetAviationFile(foldername, element.filename).subscribe(
        (data) => {
          console.log('IMAGE:', data);
          const imageUrl = 'data:image/gif;base64,' + data.filecontent; // Adjust the MIME type accordingly

          this.fileBaseUrl =
            this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);

          this.ImageArray.push(imageUrl);
        },
        (error) => {
          console.log('Error fetching JSON data:', error);
          this.loading = false;
        }
      );
    });
    setTimeout(() => {
      console.log('this.ImageArray:', this.ImageArray.length);
      this.ImageViewer(this.ImageArray);
    }, 1000);
  }

  viewFilter(items: any[], filter: string) {
  return items.filter((x) => typeof x.filename === 'string' && x.filename.includes(filter));
}

  viewFilters(items: any[], filter: string) {
    return items.filter((x) => x.filename.includes(filter));
  }

  ImagesArray2(item: any, type: any[]) {
    this.loading = true;
    console.log('ITYEM:', item, ' TYPE:', type);
    let name = item.split('_')[0];
    console.log('NAME:', name);
    let ImageArray = type.filter((x) => x.includes(name));
    console.log('Image arrays:', ImageArray);
    this.ConvertImagesArray2(ImageArray);
  }

  ConvertImagesArray2(ImageArray: any[]) {
    this.ImageArray = [];
    console.log('IMAGE ARRAY', ImageArray);
    ImageArray.forEach((element) => {
      this.APIService.GetAviationFile('winds/vectorwinds', element).subscribe(
        (data) => {
          console.log('IMAGE:', data);
          const imageUrl = 'data:image/gif;base64,' + data.filecontent; // Adjust the MIME type accordingly

          this.fileBaseUrl =
            this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);

          this.ImageArray.push(imageUrl);
        },
        (error) => {
          console.log('Error fetching JSON data:', error);
          this.loading = false;
        }
      );
    });
    setTimeout(() => {
      console.log('this.ImageArray:', this.ImageArray.length);
      this.ImageViewer(this.ImageArray);
      this.loading = false;
    }, 1000);
  }


}
