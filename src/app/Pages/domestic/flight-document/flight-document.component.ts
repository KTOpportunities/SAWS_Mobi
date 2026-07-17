import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';

interface ReportPage {
  type: 'cover' | 'content' | 'text' | 'image';
  title?: string;
  data?: any[];
  image?: SafeResourceUrl | null;
}

interface ProvinceGroup {
  province: string;
  items: any[];
}

@Component({
  selector: 'app-flight-document',
  templateUrl: './flight-document.component.html',
  styleUrls: ['./../domestic.page.scss'],
})
export class FlightDocumentComponent implements OnInit {
  loading: boolean = false;
  showReport = false;
  fileBaseUrlSynoptic: SafeResourceUrl | null = null;
  qnhImage: SafeResourceUrl | null = null;

  stationCodes: string = '';
  filteredStations: string[] = [];
  selectedOption4: string = 'All Regions';
  selectedOption6: string = 'Select Station';
  selectedOption2: string = 'xx';
  selectedOption3: string = 'xx';

  isDropdownOpen2: boolean = false;
  isDropdownOpen3: boolean = false;
  isDropdownOpen4: boolean = false;
  isDropdownOpen6: boolean = false;

  reportPages: ReportPage[] = [];
  reportDate = new Date();
  recordReference = '';

  flightSections = {
    metar: true, speci: true, taf: true, sigmet: true, amo: true, airmet: true,
    takeoff: true, warning: true, qnh: true, blockWindLow: true, blockWindHigh: true,
    barbWindLow: true, barbWindHigh: true, addLow: true, lowSigwx: true, highSigwx: true
  };

  folderData: { [key: string]: any[] } = {};
  takeOffData: any[] = [];

  domesticStations: string[] = [
    'FAOR - Johannesburg (OR Tambo)','FALA - Johannesburg (Lanseria)','FAGC - Grand Central','FARF - Rand Airport','FAWK - Waterkloof','FAWB - Wonderboom',
    'FACT - Cape Town','FAGG - George','FAOH - Oudtshoorn','FALW - Langebaanweg','FAWC - Worcester','FASB - Springbok','FAVR - Vredendal',
    'FAPE - Gqeberha (Port Elizabeth)','FAEL - East London','FAMT - Mthatha','FABE - Bhisho','FAUT - Queenstown',
    'FABL - Bloemfontein','FABM - Bethlehem','FAFB - Ficksburg','FAHR - Harrismith','FATN - Thaba Nchu',
    'FALE - Durban (King Shaka)','FAPM - Pietermaritzburg','FARB - Richards Bay','FAMG - Margate','FALK - Ladysmith',
    'FAPP - Polokwane','FAAL - Alldays','FAGI - Giyani','FALM - Louis Trichardt','FAMS - Messina (Musina)','FATZ - Tzaneen','FAPH - Phalaborwa',
    'FANS - Nelspruit','FAHS - Hoedspruit','FASZ - Skukuza',
    'FAMM - Mahikeng','FAPN - Pilanesberg','FARY - Rustenburg','FAKG - Klerksdorp',
    'FAUP - Upington','FAKM - Kimberley','FAAB - Alexander Bay','FAAG - Aggeneys','FASP - Springbok','FASS - Sishen','FAKU - Kuruman'
  ];

  regions: string[] = [
    "All Regions",'Gauteng','Limpopo','Mpumalanga','North West','Free State','KwaZulu-Natal','Northern Cape','Western Cape','Eastern Cape'
  ];

  regionStations: { [key: string]: string[] } = {
    'Gauteng': ['FAOR','FALA','FAWB','FAWK','FAGC'],
    'Western Cape': ['FACT','FAGG','FAOH','FALW','FAWC','FAVR'],
    'Eastern Cape': ['FAPE','FAEL','FAMT','FABE','FAUT'],
    'Free State': ['FABL','FABM','FAFB','FAHR','FATN'],
    'KwaZulu-Natal': ['FALE','FAPM','FARB','FAMG','FALK'],
    'Limpopo': ['FAPP','FAAL','FAGI','FALM','FAMS','FATZ','FAPH'],
    'Mpumalanga': ['FANS','FAHS','FASZ'],
    'North West': ['FAMM','FAPN','FARY','FAKG'],
    'Northern Cape': ['FAUP','FAKM','FAAB','FAAG','FASP','FASS','FAKU']
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private apiService: APIService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this.authService.getIsLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.loadAllFolders();
    }
    this.filteredStations = this.domesticStations;
  }

  NavigateToDomestic() { this.router.navigate(['/domestic']); }

  toggleDropdown(dropdown: string) {
    this.isDropdownOpen2 = dropdown === 'dropdown2'?!this.isDropdownOpen2 : false;
    this.isDropdownOpen3 = dropdown === 'dropdown3'?!this.isDropdownOpen3 : false;
    this.isDropdownOpen4 = dropdown === 'dropdown4'?!this.isDropdownOpen4 : false;
    this.isDropdownOpen6 = dropdown === 'dropdown6'?!this.isDropdownOpen6 : false;
  }

  selectOption(option: string) {
    this.selectedOption2 = option;
    this.selectedOption3 = option;
    this.isDropdownOpen2 = false;
    this.isDropdownOpen3 = false;
  }

  selectRegion(region: string) {
    this.selectedOption4 = region;
    this.isDropdownOpen4 = false;
    if (region === 'All Regions') {
      const stations = new Set<string>();
      Object.values(this.regionStations).forEach(codes => codes.forEach(code => stations.add(code)));
      this.stationCodes = Array.from(stations).sort().join(' ');
      this.filteredStations = this.domesticStations;
      return;
    }
    const codes = this.regionStations[region] || [];
    this.stationCodes = codes.join(' ');
    this.filteredStations = this.domesticStations.filter(s => codes.includes(s.split(' - ')[0]));
  }

  selectStation(station: string) {
    this.selectedOption6 = station;
    this.isDropdownOpen6 = false;
    const code = station.split(' - ')[0];
    this.stationCodes = this.stationCodes? this.stationCodes + ' ' + code : code;
  }

  clearStations() {
    this.stationCodes = '';
    this.selectedOption4 = 'All Regions';
    this.selectedOption6 = 'Select Station';
    this.filteredStations = this.domesticStations;
  }

  sortStations() {
    if (!this.stationCodes.trim()) return;
    this.stationCodes = this.stationCodes.split(/\s+/).filter(c => c).sort().join(' ');
  }

  loadAllFolders(): void {
    this.loading = true;
    this.spinner.show();

    forkJoin({
      metar: this.apiService.GetSourceTextFolderFiles('METAR').pipe(catchError(() => of([]))),
      speci: this.apiService.GetSourceTextFolderFiles('SPECI').pipe(catchError(() => of([]))),
      taf: this.apiService.GetSourceTextFolderFiles('Tafft').pipe(catchError(() => of([]))),
      sigmet: this.apiService.GetSourceTextFolderFiles('SIGMET').pipe(catchError(() => of([]))),
      airmet: this.apiService.GetSourceTextFolderFiles('AIRMET').pipe(catchError(() => of([]))),
      warnings: this.apiService.GetSourceTextFolderFiles('warnings').pipe(catchError(() => of([]))),
      takeoff: this.apiService.GetSourceTextFolderFiles('varmet').pipe(catchError(() => of([]))),
      qnhList: this.apiService.GetSourceAviationFolderFilesListNull().pipe(catchError(() => of([]))),
    }).subscribe(res => {
      this.folderData['METAR'] = res.metar;
      this.folderData['SPECI'] = res.speci;
      this.folderData['Tafft'] = res.taf;
      this.folderData['SIGMET'] = res.sigmet;
      this.folderData['AIRMET'] = res.airmet;
      this.folderData['warnings'] = res.warnings;

      this.processTakeOffData(res.takeoff);
      this.processQNH(res.qnhList);

      this.loading = false;
      this.spinner.hide();
      this.cdr.detectChanges();
    });
  }

  processQNH(files: any[]) {
    const qnh = files.find((x: any) => x.filename === 'synoptic.png');
    if (!qnh) return;
    this.apiService.GetAviationFile('', qnh.filename).subscribe({
      next: (image: any) => {
        const url = 'data:image/png;base64,' + image.filecontent;
        this.qnhImage = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.fileBaseUrlSynoptic = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }
    });
  }

  processTakeOffData(response: any[]) {
    if (!response) { this.takeOffData = []; return; }
    const airportMap = response.reduce((acc: any, item: any) => {
      const airportCode = this.getAirportCode(item);
      if (!acc[airportCode] || new Date(item.lastmodified) > new Date(acc[airportCode].lastmodified)) {
        acc[airportCode] = item;
      }
      return acc;
    }, {});
    this.takeOffData = Object.values(airportMap).filter((item: any) => item.filecontent.includes('TAKE-OFF'));
  }

  loadFolder(folderName: string): void {
    this.apiService.GetSourceTextFolderFiles(folderName).subscribe({
      next: (response: any) => { this.folderData[folderName] = response || []; },
      error: (error) => { console.error('Error loading ' + folderName, error); this.folderData[folderName] = []; }
    });
  }

  getAirportCode(item: any): string {
    const match = (item.filecontent || '').match(/\b[A-Z]{4}\b/);
    return match? match[0] : '';
  }

  getStationName(code: string): string {
    return this.domesticStations.find(s => s.startsWith(code)) || code;
  }

  getProvinceForStation(code: string): string {
    for(const [province, codes] of Object.entries(this.regionStations)) {
      if(codes.includes(code)) return province;
    }
    return 'Other';
  }

  getSelectedStations(): string[] {
    return this.stationCodes.trim()? this.stationCodes.split(/\s+/).map(x => x.trim().toUpperCase()) : [];
  }

  getLatestPerStation(files: any[]): any[] {
    const map = new Map<string, any>();
    files.forEach(f => {
      const code = this.getAirportCode(f);
      if(!code) return;
      const existing = map.get(code);
      if(!existing || new Date(f.lastmodified) > new Date(existing.lastmodified)) {
        map.set(code, f);
      }
    });
    return Array.from(map.values());
  }

  groupByProvince(files: any[]): ProvinceGroup[] {
    const selected = this.getSelectedStations();
    const filtered = selected.length === 0? files : files.filter(f => selected.includes(this.getAirportCode(f)));
    const latest = this.getLatestPerStation(filtered);

    const groups: { [key: string]: any[] } = {};
    latest.forEach(f => {
      const code = this.getAirportCode(f);
      const province = this.getProvinceForStation(code);
      if(!groups[province]) groups[province] = [];
      groups[province].push(f);
    });

    return Object.keys(groups).sort().map(p => ({ province: p, items: groups[p] }));
  }

  filterTakeOffData(): any[] {
    const stations = this.getSelectedStations();
    if (stations.length === 0) return this.takeOffData;
    return this.takeOffData.filter(item => stations.includes(this.getAirportCode(item)));
  }

  generateRecordReference(): string {
    const now = new Date();
    const hh = String(now.getUTCHours()).padStart(2, '0');
    const mm = String(now.getUTCMinutes()).padStart(2, '0');
    const yyyy = now.getUTCFullYear();
    const MM = String(now.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(now.getUTCDate()).padStart(2, '0');
    return `AWC-DFF-${hh}:${mm}/${yyyy}-${MM}-${dd}`;
  }

  viewReport() {
    this.spinner.show();
    this.reportPages = [];
    this.recordReference = this.generateRecordReference();

    this.reportPages.push({ type: 'cover' });
    this.reportPages.push({ type: 'content' });

    if (this.flightSections.metar) this.reportPages.push({ type: 'text', title: 'METAR - Meteorological Aerodrome Report', data: this.groupByProvince(this.folderData['METAR'] || []) });
    if (this.flightSections.speci) this.reportPages.push({ type: 'text', title: 'SPECI - Special Meteorological Aerodrome Report', data: this.groupByProvince(this.folderData['SPECI'] || []) });
    if (this.flightSections.taf) this.reportPages.push({ type: 'text', title: 'TAF - Terminal Aerodrome Forecast', data: this.groupByProvince(this.folderData['Tafft'] || []) });
    if (this.flightSections.sigmet || this.flightSections.airmet) this.reportPages.push({ type: 'text', title: 'SIGMET and AIRMET for South African FIR', data: [...this.folderData['SIGMET']||[],...this.folderData['AIRMET']||[]] });
    if (this.flightSections.takeoff) this.reportPages.push({ type: 'text', title: 'Take-off Data (Runway Parameters)', data: this.filterTakeOffData() });
    if (this.flightSections.warning) this.reportPages.push({ type: 'text', title: 'Aerodrome Warnings', data: this.folderData['warnings'] || [] });
    if (this.flightSections.qnh && this.qnhImage) this.reportPages.push({ type: 'image', title: 'QNH Chart', image: this.qnhImage }); // 🔥 only push if image exists

    this.showReport = true;
    setTimeout(() => {
      this.spinner.hide();
      this.cdr.detectChanges();
      window.scrollTo(0,0);
    }, 100);
  }

  closeReport() { this.showReport = false; }

  isGroupedReport(page: ReportPage): boolean {
    const t = page.title || '';
    return t.includes('METAR') || t.includes('TAF') || t.includes('SPECI');
  }
}