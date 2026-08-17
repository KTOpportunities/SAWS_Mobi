import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ViewDecodedPage } from '../../view-decoded/view-decoded.page';
import { MediaMatcher } from '@angular/cdk/layout';
import { FormBuilder } from '@angular/forms';
import { Platform, ToastController } from '@ionic/angular';
import { Keyboard } from '@capacitor/keyboard';
import { ViewColorCodedStylePage } from '../../Pages/view-color-coded-style/view-color-coded-style.page';
import { finalize } from 'rxjs';
import { forkJoin } from 'rxjs';
import { DatePipe } from '@angular/common';
export interface Metar {
  raw_text: string;
  color?: string;
}

export interface MetarReport {
  filecontent: string;
  filename?: string;
}

interface FileData {
  foldername: string;
  filename: string;
  lastmodified: string;
  filecontent: string;
}
@Component({
  selector: 'app-metar-taf-recent',
  templateUrl: './metar-taf-recent.component.html',
  styleUrls: ['./metar-taf-recent.component.scss'],
})
export class MetarTafRecentComponent implements OnInit {
  isLogged: boolean = false;
  loading: boolean = false;
  recentTafs: any[] = [];

  isKeyboardVisible = false;
  private mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;
  isMobile: boolean;
  intervalId: any;
  isDropdownOpen1: boolean = false;
  isDropdownOpen2: boolean = false;
  isDropdownOpen3: boolean = false;
  isDropdownOpen4: boolean = false;
  isDropdownOpen5: boolean = false;
  isDropdownOpen6: boolean = false;
  isDropdownOpen7: boolean = false;
  isDropdownOpen8: boolean = false;
  isDropdownOpen11: boolean = false;
  isDropdownOpen: boolean = false;
  selectedOption1: string = 'Animation Type';
  selectedOption2: string = '2024-03-20 13:15';
  selectedOption3: string = 'FAVV';
  selectedOption11: string = 'Select Plot meteogram';
  selectedOption5: string = 'Select saved Template';
  selectedOption6: string = 'Select a saved Template';
  selectedOption7: string = '5 Min';
  selectedOption8: string = '2024-03-20 13:15';
    coded: boolean=false;
    metarReports: MetarReport[] = [];
    filteredReports: MetarReport[] = [];
    groupedReportsByProvince: { [province: string]: MetarReport[] } = {};
    filteredTAFs: { [province: string]: string[] } = {};

    searchQuery: string = '';
    currentDate: string | undefined;
    currentTime: string | undefined;
    selectedProvince: string = 'Gauteng';
  searchDone = false;
  addPadding = false;
   SigmetList: any = [];
  AirmetList: any = [];
  GametList: any = [];
  filteredList: any = ([] = []);
    showSigmetSearch = false;
  
  TAFArray: FileData[] = [];
  groupedTAFs: { [province: string]: string[] } = {};


  viewModes: { [province: string]: 'normal' | 'color' } = {};
  highlightStations: string[] = ['FALA', 'FACT', 'FALE', 'FAPM', 'FYKT'];

 provinces: { [province: string]: string[] } = {
  'Gauteng': ['FAOR','FALA','FAJB','FAIR','FAWB','FAWK','FAGC','FAGM','FASI','FAVV'],
  'Limpopo': ['FAPP','FALM','FAHS','FATH','FATV','FAER','FATZ','FATI','FAVM'],
  'Mpumalanga': ['FAKN','FANS','FAEO','FASR','FAWI','FAKP','FASZ'],
  'Northwest Province': ['FAMM','FALI','FAKD','FARG','FAPN','FAPS','FAMK'],
  'Western Cape': ['FACT','FAGG','FALW','FAOB','FABY','FAPG','FAYP','FAOH'],
  'Eastern Cape': ['FAPE','FAEL','FAUT','FABE'],
  'KwaZulu Natal': ['FALE','FAPM','FARB','FAMG','FAVG','FAGY','FAUL','FALY','FANC','FAMX'],
  'Freestate': ['FABL','FABM','FAWM','FAHV','FAKS','FAFB'],
  'Northern Cape': ['FAUP','FAKM','FADY','FACV','FASB','FAAB','FASS'],
  'Lesotho': ['FXMM'],
  'Eswatini': ['FDMS','FDSK'],
  'Botswana': ['FBSK','FBMN','FBFT','FBGZ','FBJW','FBKE','FBMP','FBPA','FBTE','FBTS','FBSN','FBSP','FBSW','FBLT'],
  'Namibia': ['FYWH','FYWE','FYKM','FYKT','FYWB','FYGF','FYLZ','FYOA','FYOG','FYRU'],
  'Mozambique': ['FQMA','FQBR','FQNP','FQIN','FQLC','FQPB','FQQL','FQTE','FQTT','FQVL'],
  'Zimbabwe': ['FVRG','FVJN','FVKB','FVFA','FVCZ','FVTL','FVWN'],
  'Other Regions': ['FWKI','FWCL','FLKK','FLSK','FNLU','FLHN','FLND'],
  'Other Stations': ['FAME']
};
    airportProvinceMapping: { [key: string]: string } = {
      FAOR: 'Gauteng',
      FALA: 'Gauteng',
      FAJB: 'Gauteng',
      FAIR: 'Gauteng',
      FAWB: 'Gauteng',
      FAWK: 'Gauteng',
      FAGC: 'Gauteng',
      FAGM: 'Gauteng',
      FASI: 'Gauteng',
      FAVV: 'Gauteng',
      FAPP: 'Limpopo',
      FALM: 'Limpopo',
      FAHS: 'Limpopo',
      FATH: 'Limpopo',
      FATV: 'Limpopo',
      FAER: 'Limpopo',
      FATZ: 'Limpopo',
      FATI: 'Limpopo',
      FAVM: 'Limpopo',
      FAKN: 'Mpumalanga',
      FANS: 'Mpumalanga',
      FAEO: 'Mpumalanga',
      FASR: 'Mpumalanga',
      FAWI: 'Mpumalanga',
      FAKP: 'Mpumalanga',
      FASZ: 'Mpumalanga',
      FAMM: 'Northwest Province',
      FALI: 'Northwest Province',
      FAKD: 'Northwest Province',
      FARG: 'Northwest Province',
      FAPN: 'Northwest Province',
      FAPS: 'Northwest Province',
      FAMK: 'Northwest Province',
      FACT: 'Western Cape',
      FAGG: 'Western Cape',
      FALW: 'Western Cape',
      FAOB: 'Western Cape',
      FABY: 'Western Cape',
      FAPG: 'Western Cape',
      FAYP: 'Western Cape',
      FAOH: 'Western Cape',
      FAPE: 'Eastern Cape',
      FAEL: 'Eastern Cape',
      FAUT: 'Eastern Cape',
      FABE: 'Eastern Cape',
      FALE: 'KwaZulu Natal',
      FAPM: 'KwaZulu Natal',
      FARB: 'KwaZulu Natal',
      FAMG: 'KwaZulu Natal',
      FAVG: 'KwaZulu Natal',
      FAGY: 'KwaZulu Natal',
      FAUL: 'KwaZulu Natal',
      FALY: 'KwaZulu Natal',
      FANC: 'KwaZulu Natal',
      FAMX: 'KwaZulu Natal',
      FABL: 'Freestate',
      FABM: 'Freestate',
      FAWM: 'Freestate',
      FAHV: 'Freestate',
      FAKS: 'Freestate',
      FAFB: 'Freestate',
      FAUP: 'Northern Cape',
      FAKM: 'Northern Cape',
      FADY: 'Northern Cape',
      FACV: 'Northern Cape',
      FASB: 'Northern Cape',
      FAAB: 'Northern Cape',
      FASS: 'Northern Cape',
      FDMS: 'Eswatini',
      FDSK: 'Eswatini',
      FXMM: 'Lesotho',
      FBSK: 'Botswana',
      FBMN: 'Botswana',
      FBFT: 'Botswana',
      FBGZ: 'Botswana',
      FBJW: 'Botswana',
      FBKE: 'Botswana',
      FBMP: 'Botswana',
      FBPA: 'Botswana',
      FBTE: 'Botswana',
      FBTS: 'Botswana',
      FBSN: 'Botswana',
      FBSP: 'Botswana',
      FBSW: 'Botswana',
      FBLT: 'Botswana',
      FYWH: 'Namibia',
      FYWW: 'Namibia',
      FYWE: 'Namibia',
      FYKM: 'Namibia',
      FYKT: 'Namibia',
      FYWB: 'Namibia',
      FYGF: 'Namibia',
      FYLZ: 'Namibia',
      FYOA: 'Namibia',
      FYOG: 'Namibia',
      FYRU: 'Namibia',
      FQMA: 'Mozambique',
      FQBR: 'Mozambique',
      FQNP: 'Mozambique',
      FQIN: 'Mozambique',
      FQLC: 'Mozambique',
      FQPB: 'Mozambique',
      FQQL: 'Mozambique',
      FQTE: 'Mozambique',
      FQTT: 'Mozambique',
      FQVL: 'Mozambique',
      FVRG: 'Zimbabwe',
      FVJN: 'Zimbabwe',
      FVKB: 'Zimbabwe',
      FVFA: 'Zimbabwe',
      FVCZ: 'Zimbabwe',
      FVTL: 'Zimbabwe',
      FVWN: 'Zimbabwe',
      FWKI: 'Other Regions',
      FWCL: 'Other Regions',
      FLKK: 'Other Regions',
      FLSK: 'Other Regions',
      FNLU: 'Other Regions',
      FLHN: 'Other Regions',
      FLND: 'Other Regions',
      FAME: 'Other Stations',
    };
  
    provinceOrder: string[] = [
    'Gauteng',
    'Limpopo',
    'Mpumalanga',
    'Northwest Province',
    'Western Cape',
    'Eastern Cape',
    'KwaZulu Natal',
    'Freestate',
    'Northern Cape',
    'Lesotho',
    'Eswatini',
    'Botswana',
    'Namibia',
    'Mozambique',
    'Zimbabwe',
    'Other Regions',
    'Other Stations',
  ];
airportNames: { [code: string]: string } = {
  // Gauteng
  'FAOR': 'O. R. Tambo International Airport ',
  'FALA': 'Lanseria International Airport ',
  'FAJB': 'Johannesburg International Airport ',
  'FAIR': 'Air Force Base Waterkloof ',
  'FAWB': 'Waterkloof Air Force Base ',
  'FAWK': 'Wonderboom Airport ',
  'FAGC': 'Grand Central Airport ',
  'FAGM': 'Germiston Airport ',
  'FASI': 'Springs Airport ',
  'FAVV': 'Vaal Airport',

  // Limpopo
  'FAPP': 'Polokwane International Airport ',
  'FALM': 'Makhado Airport ',
  'FAHS': 'Hoedspruit Airport ',
  'FATH': 'Thohoyandou Airport ',
  'FATV': 'Tzaneen Airport',
  'FAER': 'Ellisras Matimba Airport ',
  'FATZ': 'Thabazimbi Airport ',
  'FATI': 'Tshipise Airport ',
  'FAVM': 'Vivo Airport ',

  // Mpumalanga
  'FAKN': 'Kruger Mpumalanga International Airport ',
  'FANS': 'Nelspruit Airport ',
  'FAEO': 'Emoyeni Airport (Emoyeni)',
  'FASR': 'Skukuza Airport ',
  'FAWI': 'White River Airport ',
  'FAKP': 'Komatipoort Airport ',
  'FASZ': 'Skukuza Airport ',

  // Northwest Province
  'FAMM': 'Mafikeng International Airport',
  'FALI': 'Lichtenburg Airport ',
  'FAKD': 'Klerksdorp Airport ',
  'FARG': 'Rustenburg Airport ',
  'FAPN': 'Potchefstroom Airport',
  'FAPS': 'Schweizer-Reneke Airport ',
  'FAMK': 'Mmabatho International Airport ',

  // Western Cape
  'FACT': 'Cape Town International Airport ',
  'FAGG': 'George Airport ',
  'FALW': 'Langebaanweg Airport ',
  'FAOB': 'Oudtshoorn Airport ',
  'FABY': 'Beaufort West Airport ',
  'FAPG': 'Plettenberg Bay Airport ',
  'FAYP': 'Ysterplaat Airport ',
  'FAOH': 'Overberg Airport ',

  // Eastern Cape
  'FAPE': 'Port Elizabeth International Airport ',
  'FAEL': 'East London Airport ',
  'FAUT': 'Umtata Airport ',
  'FABE': 'Bhisho Airport ',

  // KwaZulu-Natal
  'FALE': 'King Shaka International Airport ',
  'FAPM': 'Pietermaritzburg Airport ',
  'FARB': 'Richards Bay Airport ',
  'FAMG': 'Margate Airport ',
  'FAVG': 'Virginia Airport ',
  'FAGY': 'Greytown Airport ',
  'FAUL': 'Ulundi Airport ',
  'FALY': 'Ladysmith Airport ',
  'FANC': 'Newcastle Airport ',
  'FAMX': 'Mkuze Airport ',

  // Freestate
  'FABL': 'Bram Fischer International Airport ',
  'FABM': 'Bethlehem Airport ',
  'FAWM': 'Welkom Airport ',
  'FAHV': 'Harrismith Airport )',
  'FAKS': 'Kroonstad Airport',
  'FAFB': 'Bothaville Airport ',

  // Northern Cape
  'FAUP': 'Upington Airport ',
  'FAKM': 'Kimberley Airport ',
  'FADY': 'De Aar Airport ',
  'FACV': 'Calvinia Airport ',
  'FASB': 'Sishen Airport ',
  'FAAB': 'Alexander Bay Airport ',
  'FASS': 'Sutherland Airport ',

  // Lesotho
  'FXMM': 'Moshoeshoe I International Airport ',

  // Eswatini
  'FDMS': 'King Mswati III International Airport ',
  'FDSK': 'Matsapha Airport ',

  // Botswana
  'FBSK': 'Sir Seretse Khama International Airport ',
  'FBMN': 'Maun Airport ',
  'FBFT': 'Francistown International Airport ',
  'FBGZ': 'Kasane Airport ',
  'FBJW': 'Jwaneng Airport ',
  'FBKE': 'Keetmanshoop Airport ',
  'FBMP': 'Mopipi Airport ',
  'FBPA': 'Palapye Airport ',
  'FBTE': 'Tsabong Airport',
  'FBTS': 'Tswapong Airport ',
  'FBSN': 'Serowe Airport ',
  'FBSP': 'Sowa Town Airport ',
  'FBSW': 'Selebi-Phikwe Airport ',
  'FBLT': 'Letlhakane Airport ',

  // Namibia
  'FYWH': 'Hosea Kutako International Airport ',
  'FYWE': 'Eros Airport ',
  'FYKM': 'Katima Mulilo Airport',
  'FYKT': 'Keetmanshoop Airport ',
  'FYWB': 'Walvis Bay Airport ',
  'FYGF': 'Grootfontein Airport ',
  'FYLZ': 'Luderitz Airport ',
  'FYOA': 'Ondangwa Airport',
  'FYOG': 'Oranjemund Airport ',
  'FYRU': 'Rundu Airport ',

  // Mozambique
  'FQMA': 'Maputo International Airport ',
  'FQBR': 'Beira Airport ',
  'FQNP': 'Nacala Airport ',
  'FQIN': 'Nampula Airport ',
  'FQLC': 'Lichinga Airport ',
  'FQPB': 'Pemba Airport ',
  'FQQL': 'Quelimane Airport',
  'FQTE': 'Tete Airport ',
  'FQTT': 'Tete Airport',
  'FQVL': 'Vilankulo Airport ',

  // Zimbabwe
  'FVRG': 'Robert Gabriel Mugabe International Airport',
  'FVJN': 'Joshua Mqabuko Nkomo International Airport ',
  'FVKB': 'Kariba Airport ',
  'FVFA': 'Victoria Falls Airport',
  'FVCZ': 'Masvingo Airport ',
  'FVTL': 'Mutare Airport ',
  'FVWN': 'Hwange National Park Airport',

  // Other Regions
  'FWKI': 'Kisumu Airport ',
  'FWCL': 'Chlef International Airport',
  'FLKK': 'Kikwit Airport ',
  'FLSK': 'Sassandra Airport ',
  'FNLU': 'Luanda Airport ',
  'FLHN': 'Honiara International Airport',
  'FLND': "N'Djamena International Airport",

  // Other Stations
  'FAME': 'Malamala Game Reserve Airport',
};
  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: APIService,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private mediaMatcher: MediaMatcher,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private toastController: ToastController,
    private platform: Platform,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {
    this.mobileQuery = this.mediaMatcher.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => (this.isMobile = this.mobileQuery.matches);
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
    this.isMobile = this.mobileQuery.matches;

    Keyboard.addListener('keyboardWillShow', () => {
      this.isKeyboardVisible = true;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      this.isKeyboardVisible = false;
    });

      this.mobileQuery = this.mediaMatcher.matchMedia('(max-width: 600px)');
      this.mobileQueryListener = () => (this.isMobile = this.mobileQuery.matches);
      this.mobileQuery.addEventListener('change', this.mobileQueryListener);
      this.isMobile = this.mobileQuery.matches;
  
      Keyboard.addListener('keyboardWillShow', () => {
        this.isKeyboardVisible = true;
      });
  
      Keyboard.addListener('keyboardWillHide', () => {
        this.isKeyboardVisible = false;
      });
  }

    

   ngOnInit() {
    this.getFirstMetar();
      this.fetchSigmetReports();
      this.fetchMetarReports();
      this.updateDateTime();
      setInterval(() => {
        this.updateDateTime();
      }, 1000);

      this.TAFArray = [];
const allTAFs: { [icao: string]: string } = {};

this.apiService.GetSourceTextFolderFilesTime('taffc', 72).subscribe(
  (response: FileData[]) => {
    this.TAFArray = [...this.TAFArray, ...response];

    if (response.length > 0) {
      this.updateTime(response[0].lastmodified); // 👈 set currentDate & currentTime
    }

    response.forEach(file => {
      const matches = file.filecontent.match(/TAF\s+[A-Z]{4}[\s\S]*?=/g);
      if (matches) {
        matches.forEach(entry => {
          const match = entry.match(/TAF\s+([A-Z]{4})/);
          const icao = match?.[1];
          if (icao) {
            allTAFs[icao] = entry.trim();
          }
        });
      }
    });

    this.groupTAFsByProvince(allTAFs);
    this.spinner.hide();
  }
);
this.apiService.GetSourceTextFolderFilesTime('tafft', 72).subscribe(
  (response: FileData[]) => {
    this.TAFArray = [...this.TAFArray, ...response];

    if (response.length > 0) {
      this.updateTime(response[0].lastmodified); // 👈 set currentDate & currentTime
    }

    response.forEach(file => {
      const matches = file.filecontent.match(/TAF\s+[A-Z]{4}[\s\S]*?=/g);
      if (matches) {
        matches.forEach(entry => {
          const match = entry.match(/TAF\s+([A-Z]{4})/);
          const icao = match?.[1];
          if (icao) {
            allTAFs[icao] = entry.trim();
          }
        });
      }
    });

    this.groupTAFsByProvince(allTAFs);
    this.updateTime(new Date().toISOString());

  setInterval(() => {
    this.updateTime(new Date().toISOString());
  }, 1000); // updates every second
    this.spinner.hide();
  }
);
    }

  NavigateToObservation() {
    this.router.navigate(['/observation']);
  }

  fetchRecentTafs(): void {
   
    this.loading = true; // Set loading to true when fetching starts
    this.spinner.show(); // Show the spinner

    const foldername = 'taffc'; // Specify the folder name
    this.apiService.getRecentTafsTime(foldername, 6).subscribe(
      (data) => {
        // Assign fetched data to recentTafs array
        this.recentTafs = data;
       
        console.log('TEST:', this.recentTafs);
        // Set loading to false when fetching is complete
        this.loading = false;
        // Hide the spinner
        this.spinner.hide();
      },
      (error) => {
        // Log error to console
        console.error('Error fetching recent TAFs:', error);
        // Set loading to false when an error occurs
        this.loading = false;
        // Hide the spinner
        this.spinner.hide();
      }
    );
  }

 selectOption(option: string, dropdown: string) {
  if (dropdown === 'dropdown11') {
    this.selectedOption11 = option;
    this.isDropdownOpen11 = false;
    
    // Clear any existing interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Parse selected time
    const minutes = parseInt(option);
    const intervalMs = minutes * 60 * 1000;

    // Set up interval to refresh page
    this.intervalId = setInterval(() => {
      this.refreshPage();
    }, intervalMs);
  }

  // your existing code for other dropdowns...
}
refreshPage() {
  this.fetchMetarReports();
  this.fetchSigmetReports();
  // Optional: reset search if needed
  if (this.searchQuery) {
    this.onSearch();
  }
}


  selectDropdown(dropdown: string) {
    if (dropdown === 'dropdown5') {
      this.isDropdownOpen5 = !this.isDropdownOpen5;
      this.isDropdownOpen6 = false;
      this.isDropdownOpen7 = false;
      this.isDropdownOpen11 = false;
    }
    if (dropdown === 'dropdown6') {
      this.isDropdownOpen6 = !this.isDropdownOpen6;
      this.isDropdownOpen5 = false;
      this.isDropdownOpen7 = false;
    }
    if (dropdown === 'dropdown7') {
      this.isDropdownOpen7 = !this.isDropdownOpen7;
      this.isDropdownOpen6 = false;
      this.isDropdownOpen5 = false;
    }
    if (dropdown === 'dropdown11') {
      this.isDropdownOpen11 = !this.isDropdownOpen11;
      this.isDropdownOpen5 = false;
    }
     this.addPadding = this.isDropdownOpen6 || this.isDropdownOpen5 || this.isDropdownOpen11;
  }
  isLoading: boolean = true;
  item: any;
  ImageViewer(item: any) {
    console.log('file Name:', item);
    const folderName = 'sigw';
    const fileName = item;
    console.log('Folder Name:', folderName);
    this.isLoading = true;

    this.isLoading = false;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '80%';
    dialogConfig.height = '80%';
    dialogConfig.data = { item };

    const dialogRef = this.dialog.open(ViewDecodedPage, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      this.isLoading = false;
    });
  }
  
    updateDateTime() {
      const now = new Date();
      this.currentDate = now.toLocaleDateString('en-CA');
      this.currentTime = now.toLocaleTimeString();
    }
onSearch(): void {
  const query = this.searchQuery?.trim();

  if (!query) {
    // Reset filters if search is empty
    this.filteredReports = [];
    this.SigmetList = [];
    this.filteredTAFs = {};   // 👈 clear TAF search results
    this.searchDone = false;
    this.groupedReportsByProvince = {};
    return;
  }

  // Filter METARs
  this.filteredReports = this.metarReports.filter(report =>
    report.filecontent.toLowerCase().includes(query.toLowerCase())
  );

  // Filter TAFs by ICAO or text
  Object.keys(this.groupedTAFs).forEach(province => {
    this.filteredTAFs[province] = this.groupedTAFs[province].filter(taf =>
      taf.toLowerCase().includes(query.toLowerCase())
    );
  });

  // SIGMET logic
  if (!this.showSigmetSearch) {
    this.SigmetList = [];
  } else {
    this.fetchSigmetReports();
  }

  this.searchDone = true;
  this.groupFilteredReportsByProvince();
}



  


fetchMetarReports(): void {
  this.loading = true;
  this.spinner.show();

  forkJoin({
    metar: this.apiService.getMetarReports('metar', 6),
    tafft: this.apiService.getMetarReports('tafft', 6),
    taffc: this.apiService.getMetarReports('taffc', 6),
  }).pipe(
    finalize(() => {
      this.loading = false;
      this.spinner.hide();
      this.cdr.markForCheck();
    })
  ).subscribe({
    next: ({ metar, tafft, taffc }) => {
      try {
        let combinedReports: string[] = [];

        [metar, tafft, taffc].forEach((data: MetarReport[]) => {
          for (const rawItem of data) {
            const parsed = this.parseRawMetarTafData(rawItem.filecontent);
            combinedReports = combinedReports.concat(parsed);
          }
        });

        this.metarReports = combinedReports.map(r => ({ filecontent: r }));
        this.filteredReports = [...this.metarReports];
        this.groupFilteredReportsByProvince();

        console.log('✅ Combined Reports:', this.metarReports);
      
      } catch (e) {
        console.error('Processing error (METAR/TAF):', e);
      }
    },
    error: (error) => {
      console.error('Error fetching METAR/TAF:', error);
    }
  });
}



  
    getProvinceFromContent(content: string): string {
      const match = content.match(/\b([A-Z]{4})\b/);
      if (match) {
        const icao = match[1];
        if (icao in this.airportProvinceMapping) {
          return this.airportProvinceMapping[icao];
        }
      }
      return ''; // Always return string
    }
  
  // Helper: parse "071430Z" date/time string to a Date object (UTC)
  parseMetarTimestamp(metar: string): Date | null {
    const regex = /(METAR|TAF)\s+([A-Z]{4})\s+(\d{2})(\d{2})(\d{2})Z/;
    const match = metar.match(regex);
    if (!match) return null;
  
    const day = parseInt(match[1], 10);
    const hour = parseInt(match[2], 10);
    const minute = parseInt(match[3], 10);
  
    // Construct a date with current month/year, day/hour/minute UTC
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();
  
    return new Date(Date.UTC(year, month, day, hour, minute));
  }
  
  groupFilteredReportsByProvince(): void {
    this.groupedReportsByProvince = {};
  
    for (const report of this.filteredReports) {
      const content = report.filecontent;
      const airportMatch = content.match(/\b([A-Z]{4})\b/);
      if (!airportMatch) continue;
  
      const airportCode = airportMatch[1];
      const province = this.airportProvinceMapping[airportCode];
      if (!province) continue;
  
      const reportDate = this.parseMetarTimestamp(content);
      if (!reportDate) continue;
  
      if (!this.groupedReportsByProvince[province]) {
        this.groupedReportsByProvince[province] = [];
      }
  
      // Find if a report for this airport already exists
      const existingIndex = this.groupedReportsByProvince[province].findIndex(
        (r) => {
          const match = r.filecontent.match(/\b([A-Z]{4})\b/);
          return match && match[1] === airportCode;
        }
      );
  
      if (existingIndex === -1) {
        this.groupedReportsByProvince[province].push(report);
      } else {
        // Compare existing report's timestamp
        const existingReport = this.groupedReportsByProvince[province][existingIndex];
        const existingDate = this.parseMetarTimestamp(existingReport.filecontent);
  
        if (existingDate && reportDate > existingDate) {
          // Replace with newer report
          this.groupedReportsByProvince[province][existingIndex] = report;
        }
      }
    }
  }
  
  
    // Needed to loop over object keys in template
   objectKeys(obj: any): string[] {
    return this.provinceOrder.filter(province => obj.hasOwnProperty(province));
  }
  
parseRawMetarTafData(rawData: string): string[] {
  const lines = rawData.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const reports: string[] = [];
  let buffer: string[] = [];

  for (const line of lines) {
    if (/^(METAR|TAF)/i.test(line)) {
      // Flush any previous report
      if (buffer.length) {
        reports.push(buffer.join(' '));
        buffer = [];
      }
      buffer.push(line);
    } else if (buffer.length) {
      // Continuation of previous METAR/TAF
      buffer.push(line);
    }
    // If line ends with "=", close the report
    if (line.endsWith('=')) {
      if (buffer.length) {
        reports.push(buffer.join(' '));
        buffer = [];
      }
    }
  }

  // In case the last one wasn’t flushed
  if (buffer.length) {
    reports.push(buffer.join(' '));
  }

  return reports;
}




  
  
    navigateToObservation(): void {
      this.router.navigate(['/observation']);
    }
  
    ViewColorCodedStyle() {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = true;
      dialogConfig.width = '80%';
      dialogConfig.height = '80%';
  
  
      const dialogRef = this.dialog.open(ViewColorCodedStylePage, dialogConfig);
  
      dialogRef.afterClosed().subscribe(() => {
        this.loading = false;
      });
    }
  parseColorCoded(metar: string): SafeHtml {
    if (!metar) return '';
  
    let colored = metar;
  
    // Color wind speed (e.g. 36009KT) - blue shades depending on speed
    colored = colored.replace(/(\d{3})(\d{2})KT/g, (_match, dir, speed) => {
      const speedNum = parseInt(speed, 10);
      let color = '#00386c'; // blue-light default
      if (speedNum > 10) color = '#00008b';       // blue-bold
      else if (speedNum > 5) color = '#00386c';   // blue-medium
  
      return `<span style="color: ${color};">${dir}${speed}KT</span>`;
    });
  
    // Color variable wind direction (e.g. 290V040) - black
    colored = colored.replace(/(\d{3}V\d{3})/g, '<span style="color:#00008b;">$1</span>');
  
    // Visibility 9999 or similar - blue
    colored = colored.replace(/\b9999\b/g, '<span style="color: #00008b;">9999</span>');
  
    // Clouds: FEW, SCT, BKN, OVC with height (in hundreds of feet)
    colored = colored.replace(/(FEW|SCT|BKN|OVC)(\d{3})/g, (_match, type, level) => {
      const levelNum = parseInt(level, 10);
      const heightMeters = levelNum * 30.48;
      let color = '';
  
      if (type === 'BKN' || type === 'OVC') {
        if (heightMeters < 1000) color = '#00008b';    // blue-bold
        else if (heightMeters < 3000) color = 'orange';
        else color = 'yellow';
      } else {
        color = 'green'; // FEW and SCT clouds
      }
  
      return `<span style="color: ${color};">${type}${level}</span>`;
    });
  
    // Temperature/Dewpoint (e.g. 17/05, M02/M04) with color logic
    colored = colored.replace(/(\s|^)(M?\d{2})\/(M?\d{2})(\s|$)/g, (_match, pre, tempStr, dewStr, post) => {
      const temp = parseInt(tempStr.replace('M', '-'), 10);
      const dew = parseInt(dewStr.replace('M', '-'), 10);
      const diff = Math.abs(temp - dew);
  
      let color = 'teal'; // default
      if (temp === dew) color = 'lime';
      else if (diff < 5) color = 'green';
      else if (diff > 10) color = 'red';
  
      return `${pre}<span style="color: ${color};">${tempStr}/${dewStr}</span>${post}`;
    });
  
    // QNH pressure (Qxxxx) - purple
    colored = colored.replace(/Q(\d{4})/g, '<span style="color: #00386c;">Q$1</span>');
  
    // Trend keywords (NOSIG, BECMG, TEMPO, NSW) - blue bold
    colored = colored.replace(/\b(NOSIG|BECMG|TEMPO|NSW)\b/g, '<span style="color:#00386c; font-weight: bold;">$1</span>');
  
    // Remarks keyword RMK - orange
    colored = colored.replace(/\b(RMK)\b/g, '<span style="color: orange;">$1</span>');
  
    // End '=' sign - gray
    colored = colored.replace(/=$/, '<span style="color: gray;">=</span>');
  
    // *** Your requested addition: color missing/unknown weather groups like //// // ////// as purple bold ***
    colored = colored.replace(/(\/{4}( \/{2})?( \/{6})?)/g, '<span style="color: purple; font-weight: bold;">$1</span>');
  
    return this.sanitizer.bypassSecurityTrustHtml(colored);
  }
  
  
  viewMode: { [key: string]: 'normal' | 'color' } = {};
  
  toggleView(report: any) {
    const key = report.filename; // Use a unique property per report
    this.viewMode[key] = this.viewMode[key] === 'color' ? 'normal' : 'color';
  }
  toggleCoded(): void {
    this.coded = !this.coded;
  }

  getAirportCode(filecontent: string): string {
  // Assuming METAR format: "METAR FAOR 302300Z ..."
  return filecontent.split(' ')[1];
}
 getReportDate(report: string): string {
  // Match either METAR or TAF
  const match = report.match(/^(METAR|TAF)\s+\w{4}\s+(\d{6})Z/);
  if (!match) return '';

  const dt = match[2]; // DDHHMM
  const day = dt.substring(0, 2);
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();

  return `${year}-${month}-${day}`;
}

getReportTime(report: string): string {
  const match = report.match(/^(METAR|TAF)\s+\w{4}\s+(\d{6})Z/);
  if (!match) return '';

  const dt = match[2];
  const hour = dt.substring(2, 4);
  const minute = dt.substring(4, 6);

  return `${hour}:${minute}Z`;
}


  getFirstMetar(): string | null {
    const provinces = Object.keys(this.groupedReportsByProvince);
    if (!provinces.length) return null;
    const firstProvince = provinces[0];
    if (!this.groupedReportsByProvince[firstProvince]?.length) return null;
    return this.groupedReportsByProvince[firstProvince][0].filecontent;
  }

  async loadSigmetAndAirmet() {
    this.isLoading = true;

    const firMapping: { [key: string]: string } = {
      'FACA CAPE TOWN FIR': 'FACA (CAPE TOWN FIR)',
      'FAJO JOHANNESBURG OCEANIC FIR': 'FAJO (JOHANNESBURG OCEANIC FIR)',
      'FAJA JOHANNESBURG FIR': 'FAJA (JOHANNESBURG FIR)',
    };

    const sortedFirs = Object.keys(firMapping).sort((a, b) => b.length - a.length);

    // Helper to process each response
    const processResponse = (response: any[]) =>
      response
        .map((el: any) => {
          const fileContent = el.filecontent.toUpperCase();
          const afterFaor = fileContent.split('FAOR-')[1] || '';
          const firKey = sortedFirs.find(fir =>
            new RegExp(`\\b${fir}\\b`).test(afterFaor)
          );

          return {
            heading: firKey ? firMapping[firKey] : 'Unknown FIR',
            filecontent: el.filecontent,
          };
        })
        .filter(el => el.heading !== 'Unknown FIR');

    // Fetch both requests in parallel
    this.apiService.GetSourceTextFolderFiles('sigmet').subscribe((sigmets: any[]) => {
     
        const sigmetList = processResponse(sigmets);
     console.log("DATA:",sigmetList)

        // Combine both arrays
        this.SigmetList = [...sigmetList];
    
        // Custom order
        const customOrder = ['Search', 'FAJA (JOHANNESBURG FIR)', 'FACA (CAPE TOWN FIR)', 'FAJO (JOHANNESBURG OCEANIC FIR)'];

        // Sort according to custom order
        this.SigmetList.sort((a: any, b: any) => {
          const indexA = customOrder.indexOf(a.heading);
          const indexB = customOrder.indexOf(b.heading);
          return indexA - indexB;
        });

        console.log("Combined Data (sorted):", this.SigmetList);
        this.isLoading = false;
    });
  }

  formatSigmetForDisplay(content: string): string {
    if (!content) return '';

    let cleaned = content
      .replace(/[\u0000-\u0009\u000B-\u000C\u000E-\u001F]+/g, '')
      .replace(/\r\r\n|\r\n|\r/g, '\n')
      .replace(/^\s*\d+\s*$/gm, '')
      .trim();

    const startRegex = /\bFA(?:CA|JA|JO)\s+(?:SIGMET)\b/;
    const startIdx = cleaned.search(startRegex);
    cleaned = startIdx >= 0 ? cleaned.slice(startIdx) : cleaned;

    const endIdx = cleaned.indexOf('=');
    let singleMsg = endIdx >= 0 ? cleaned.slice(0, endIdx + 1) : cleaned;

    singleMsg = singleMsg.replace(/FAOR-(?!\n)/g, 'FAOR-\n');
    singleMsg = singleMsg.replace(/\bWI\b(?!\n)/g, 'WI\n');
    singleMsg = singleMsg.replace(/\n{2,}/g, '\n');

    const lines = singleMsg.split('\n');
    const formattedLines = lines.map(line => {
      if (line.match(/[NS]\d{4}\s+[EW]\d{5}/)) {
        const parts = line.split(/\s*-\s*/);
        const padded = parts.map(p => p.trim().padEnd(15, ' '));
        return padded.join(' - ');
      }
      return line;
    });

    return formattedLines.join('\n').trim().replace(/\n/g, '<br>');
  }

filterbySearch(): void {
  const query = this.searchQuery?.trim();

  if (!query) {
    // Empty query: clear all results
    this.filteredReports = [];
    this.SigmetList = [];
    this.searchDone = false;
    this.groupedReportsByProvince = {};
    return;
  }

  // Filter METARs
  this.filteredReports = this.metarReports.filter(report =>
    report.filecontent.toLowerCase().includes(query.toLowerCase())
  );

  // Filter SIGMETs if enabled
  if (!this.showSigmetSearch) {
    this.SigmetList = [];
  } else {
    this.fetchSigmetReports();
  }

  this.searchDone = true;
  this.groupFilteredReportsByProvince();
}


async fetchSigmetReports(): Promise<void> {
  this.loading = true;
  this.spinner.show();

  const firMapping: { [key: string]: string } = {
    'FACA CAPE TOWN FIR': 'FACA (CAPE TOWN FIR)',
    'FAJO JOHANNESBURG OCEANIC FIR': 'FAJO (JOHANNESBURG OCEANIC FIR)',
    'FAJA JOHANNESBURG FIR': 'FAJA (JOHANNESBURG FIR)',
  };

  const sortedFirs = Object.keys(firMapping).sort((a, b) => b.length - a.length);

  const processResponse = (response: any[]) =>
    response
      .map((el: any) => {
        const fileContent = el.filecontent.toUpperCase();
        const afterFaor = fileContent.split('FAOR-')[1] || '';
        const firKey = sortedFirs.find(fir =>
          new RegExp(`\\b${fir}\\b`).test(afterFaor)
        );

        return {
          heading: firKey ? firMapping[firKey] : 'Unknown FIR',
          filecontent: el.filecontent,
        };
      })
      .filter(el => el.heading !== 'Unknown FIR');

  this.apiService.getMetarReports('sigmet', 3000).pipe(
    finalize(() => {
      this.loading = false;
      this.spinner.hide();
      this.cdr.markForCheck();
    })
  ).subscribe({
    next: (data: any[]) => {
      try {
        const sigmetList = processResponse(data);

        // Apply custom order for headings
        const customOrder = [
          'Search',
          'FAJA (JOHANNESBURG FIR)',
          'FACA (CAPE TOWN FIR)',
          'FAJO (JOHANNESBURG OCEANIC FIR)'
        ];

        this.SigmetList = sigmetList.sort((a: any, b: any) => {
          const indexA = customOrder.indexOf(a.heading);
          const indexB = customOrder.indexOf(b.heading);
          return indexA - indexB;
        });

        console.log('Sorted SIGMETs:', this.SigmetList);
      } catch (e) {
        console.error('Processing error:', e);
      }
    },
    error: (error) => {
      console.error('Error fetching SIGMET Reports:', error);
    }
  });
}


  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
    Keyboard.removeAllListeners();
  }





 updateTime(date?: string) {
  if (!date) return;

  const parsedDate = new Date(date);

  this.currentDate = this.datePipe.transform(parsedDate, 'yyyy-MM-dd') || '';
  this.currentTime = this.datePipe.transform(parsedDate, 'HH:mm:ss') || '';
}

   forecastPageNavigation() {
    this.router.navigate(['/forecast']);
  }
    ScrollToTop(value: any) {
    var element = document.getElementById(value);
    element?.scrollIntoView({ behavior: 'smooth' });
  }
 extractHeadingContent(filecontent: string): string {
    const match = filecontent.match(/TAF[\s\S]*?(?=TEMPO|$)/);
    return match ? match[0] : '';
  }

   extractRemainingContent(filecontent: string): string {
    const index = filecontent.indexOf('TEMPO');
    return index >= 0 ? filecontent.substring(index + 5) : '';
  }

groupTAFsByProvince(allTAFs: { [icao: string]: string }) {
  const grouped: { [province: string]: string[] } = {};

  for (const province in this.provinces) {
    grouped[province] = [];

    this.provinces[province].forEach(station => {
      if (allTAFs[station]) {
        grouped[province].push(allTAFs[station]);
      } else {
        grouped[province].push(`No data for ${station}`);
      }
    });

    // Default view mode
    this.viewModes[province] = 'normal';
  }

  this.groupedTAFs = grouped;
}

// toggleView(province: string): void {
//   this.viewModes[province] =
//     this.viewModes[province] === 'normal' ? 'color' : 'normal';
// }

  isHighlighted(taf: string): boolean {
  return this.highlightStations.some(station => taf.includes(`TAF ${station}`));
}
getFilteredProvinces(): string[] {
  // If no search, return all provinces
  if (!this.searchDone) {
    return Object.keys(this.groupedTAFs);
  }

  // When searching, return only provinces that have matches
  return Object.keys(this.groupedTAFs).filter(province => {
    const hasMetars = this.groupedReportsByProvince[province]?.some(r =>
      r.filecontent.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    const hasTafs = this.filteredTAFs[province] && this.filteredTAFs[province].length > 0;

    return hasMetars || hasTafs;
  });
}

// Helper: extract timestamp from SIGMET string (returns Date)
extractSigmetTimestamp(sigmet: string): Date {
  const match = sigmet.match(/VALID\s+(\d{2})(\d{2})(\d{2})/);
  if (!match) return new Date(0); // fallback to old date
  const day = parseInt(match[1], 10);
  const hour = parseInt(match[2], 10);
  const minute = parseInt(match[3], 10);

  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), day, hour, minute));
}


}


