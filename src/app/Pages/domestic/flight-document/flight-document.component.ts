import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController } from '@ionic/angular';
import { ViewSymbolPage } from '../../view-symbol/view-symbol.page';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
interface ReportPage { type: 'cover' | 'content' | 'text' | 'image'; title?: string; data?: any[]; image?: SafeResourceUrl | null; }
interface ProvinceGroup { province: string; items: any[]; }
interface WindImage { hour: string; type: 'WL'|'WH'|'ZFL'; image: SafeResourceUrl; filename: string; }

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

  windImages: WindImage[] = []; // now stores filename too

  stationCodes: string = '';
  filteredStations: string[] = [];
  selectedOption4: string = 'All Regions';
  selectedOption6: string = 'Select Station';
  selectedOption2: string = 'xx'; // FCST Hour for winds
  selectedOption3: string = 'xx'; // Chart Hour for sigwx

  isDropdownOpen2: boolean = false;
  isDropdownOpen3: boolean = false;
  isDropdownOpen4: boolean = false;
  isDropdownOpen6: boolean = false;

  reportPages: ReportPage[] = [];
  reportDate = new Date();
  recordReference = '';

  flightSections = {
    metar: true, speci: true, taf: true, sigmet: true, airmet: true, amo: true,
    takeoff: true, warning: true, qnh: true,
    blockWindLow: true, blockWindHigh: true,
    barbWindLow: true, barbWindHigh: true,
    addLow: true, lowSigwx: true, highSigwx: true,
    symbols: true, coverPage: true, pageBreaks: true, rotateImages: true, selectAll: true
  };

  folderData: { [key: string]: any[] } = {};
  takeOffData: any[] = [];
  windsData: any[] = [];
  vectorData: any[] = [];

  domesticStations: string[] = ['FAOR - Johannesburg (OR Tambo)','FALA - Johannesburg (Lanseria)','FAGC - Grand Central','FARF - Rand Airport','FAWK - Waterkloof','FAWB - Wonderboom','FAJB - Johannesburg','FACT - Cape Town','FAGG - George','FAOH - Oudtshoorn','FALW - Langebaanweg','FAWC - Worcester','FASB - Springbok','FAVR - Vredendal','FABY - Beaufort West','FAPG - Port Elizabeth','FAPE - Gqeberha (Port Elizabeth)','FAEL - East London','FAMT - Mthatha','FABE - Bhisho','FAUT - Queenstown','FABL - Bloemfontein','FABM - Bethlehem','FAFB - Ficksburg','FAHR - Harrismith','FATN - Thaba Nchu','FAWM - Welkom','FAHV - Virginia','FAKS - Kroonstad','FALE - Durban (King Shaka)','FAPM - Pietermaritzburg','FARB - Richards Bay','FAMG - Margate','FAGY - Greytown','FAUL - Ulundi','FALY - Ladysmith','FANC - Newcastle','FAMX - Mkuze','FAPP - Polokwane','FAAL - Alldays','FAGI - Giyani','FALM - Louis Trichardt','FAMS - Messina (Musina)','FATZ - Tzaneen','FAPH - Phalaborwa','FAHS - Hoedspruit','FATI - Thoyandou','FAER - Ellisras','FANS - Nelspruit','FAEO - Ermelo','FASR - Standerton','FAWI - Witbank','FAKP - Kruger Mpumalanga','FAKN - Nelspruit','FASZ - Skukuza','FAMM - Mahikeng','FAPN - Pilanesberg','FARY - Rustenburg','FAKG - Klerksdorp','FAKD - Klerksdorp','FALI - Lichtenburg','FARG - Rustenburg','FAPS - Potchefstroom','FAMK - Mafikeng','FAUP - Upington','FAKM - Kimberley','FAAB - Alexander Bay','FAAG - Aggeneys','FASP - Springbok','FASS - Sishen','FAKU - Kuruman','FACV - Calvinia','FADY - De Aar','FXMM - Maseru','FDMS - Matsapha','FDSK - King Mswati','FBSK - Gaborone','FBMN - Maun','FBKE - Kasane','FYWH - Windhoek','FYWE - Eros','FYKM - Keetmanshoop','FYKT - Katima Mulilo','FYWB - Walvis Bay','FYGF - Grootfontein','FYLZ - Luderitz','FYOA - Ondangwa','FYOG - Oranjemund','FYRU - Rundu','FQMA - Maputo','FQBR - Beira','FQNP - Nampula','FQIN - Inhambane','FQLC - Lichinga','FQPB - Pemba','FQQL - Quelimane','FQTT - Tete','FQVL - Vilanculos','FVRG - Harare','FVJN - Joshua Mqabuko','FVFA - Victoria Falls','FWKI - Lilongwe','FWCL - Chileka','FNLU - Luanda'];
  regions: string[] = ["All Regions",'Gauteng','Limpopo','Mpumalanga','North West','Free State','KwaZulu Natal','Northern Cape','Western Cape','Eastern Cape'];
  regionStations: { [key: string]: string[] } = { 'Gauteng': ['FAOR','FALA','FAWB','FAWK','FAGC','FAJB'], 'Western Cape': ['FACT','FAGG','FAOH','FALW','FAWC','FAVR','FABY','FAPG'], 'Eastern Cape': ['FAPE','FAEL','FAMT','FABE','FAUT'], 'Free State': ['FABL','FABM','FAFB','FAHR','FATN','FAWM','FAHV','FAKS'], 'KwaZulu Natal': ['FALE','FAPM','FARB','FAMG','FAGY','FAUL','FALY','FANC','FAMX'], 'Limpopo': ['FAPP','FAAL','FAGI','FALM','FAMS','FATZ','FAPH','FAHS','FATI','FAER'], 'Mpumalanga': ['FANS','FAEO','FASR','FAWI','FAKP','FAKN','FASZ'], 'North West': ['FAMM','FAPN','FARY','FAKG','FAKD','FALI','FARG','FAPS','FAMK'], 'Northern Cape': ['FAUP','FAKM','FAAB','FAAG','FASP','FASS','FAKU','FACV','FADY'] };

  constructor(private router: Router, private authService: AuthService, private spinner: NgxSpinnerService, private apiService: APIService, private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef, private modalCtrl: ModalController) {}

  ngOnInit() { if (!this.authService.getIsLoggedIn()) this.router.navigate(['/login']); else this.loadAllFolders(); this.filteredStations = this.domesticStations; }
  NavigateToDomestic() { this.router.navigate(['/domestic']); }

  toggleDropdown(dropdown: string) {
    this.isDropdownOpen2 = dropdown === 'dropdown2'?!this.isDropdownOpen2 : false;
    this.isDropdownOpen3 = dropdown === 'dropdown3'?!this.isDropdownOpen3 : false;
    this.isDropdownOpen4 = dropdown === 'dropdown4'?!this.isDropdownOpen4 : false;
    this.isDropdownOpen6 = dropdown === 'dropdown6'?!this.isDropdownOpen6 : false;
  }
toggleSelectAll() {
  const selectAll = this.flightSections.selectAll;

  // Set all checkboxes to the same value as Select All
  Object.keys(this.flightSections).forEach((key: string) => {
    (this.flightSections as any)[key] = selectAll;
  });
}
selectOption2(option: string) {
  this.selectedOption2 = option;
  this.closeAllDropdowns();

  if (option !== 'xx') {
    this.flightSections.blockWindLow = true;
    this.flightSections.blockWindHigh = true;
    this.flightSections.barbWindLow = true;
    this.flightSections.barbWindHigh = true;
  }
}

selectOption3(option: string) {
  this.selectedOption3 = option;
  this.closeAllDropdowns();
}

selectRegion(region: string) {
  this.selectedOption4 = region;
  this.closeAllDropdowns();

  this.selectedOption6 = 'Select Station';

  if (region === 'All Regions') {
    this.filteredStations = [...this.domesticStations];
    this.stationCodes = this.domesticStations
      .map(station => station.split(' - ')[0])
      .join(' ');
    return;
  }

  const codes = this.regionStations[region] || [];

  this.filteredStations = this.domesticStations.filter(station =>
    codes.includes(station.split(' - ')[0])
  );

  this.stationCodes = codes.join(' ');
}

selectStation(station: string) {
  this.selectedOption6 = station;
  this.closeAllDropdowns();

  const code = station.split(' - ')[0];
  this.stationCodes = code;
}

  clearStations() {
  this.stationCodes = '';
  this.selectedOption4 = 'All Regions';
  this.selectedOption6 = 'Select Station';
  this.filteredStations = [...this.domesticStations];
} sortStations() { if (!this.stationCodes.trim()) return; this.stationCodes = this.stationCodes.split(/\s+/).filter(c => c).sort().join(' '); }

  loadAllFolders(): void {
    this.loading = true; this.spinner.show();
    forkJoin({
      metar: this.apiService.GetSourceTextFolderFiles('METAR').pipe(catchError(() => of([]))),
      speci: this.apiService.GetSourceTextFolderFiles('SPECI').pipe(catchError(() => of([]))),
      taf: this.apiService.GetSourceTextFolderFiles('Tafft').pipe(catchError(() => of([]))),
      sigmet: this.apiService.GetSourceTextFolderFiles('SIGMET').pipe(catchError(() => of([]))),
      airmet: this.apiService.GetSourceTextFolderFiles('AIRMET').pipe(catchError(() => of([]))),
      warnings: this.apiService.GetSourceTextFolderFiles('warnings').pipe(catchError(() => of([]))),
      takeoff: this.apiService.GetSourceTextFolderFiles('varmet').pipe(catchError(() => of([]))),
      qnhList: this.apiService.GetSourceAviationFolderFilesListNull().pipe(catchError(() => of([]))),
      winds: this.apiService.GetSourceAviationFolderFilesList('winds/blockwinds').pipe(catchError(() => of([]))),
      vector: this.apiService.GetSourceAviationFolderFilesList('winds/vectorwinds').pipe(catchError(() => of([]))),
    }).subscribe(res => {
      this.folderData['METAR'] = res.metar; this.folderData['SPECI'] = res.speci; this.folderData['Tafft'] = res.taf;
      this.folderData['SIGMET'] = res.sigmet; this.folderData['AIRMET'] = res.airmet; this.folderData['warnings'] = res.warnings;
      this.windsData = res.winds || []; this.vectorData = res.vector || [];
      this.processTakeOffData(res.takeoff); this.loadQNH(res.qnhList);
      this.processWindImages(); // <-- now loads actual base64
      this.loading = false; this.spinner.hide(); this.cdr.detectChanges();
    });
  }

  async processWindImages() {
    this.windImages = [];
    const allFiles = [...this.windsData,...this.vectorData];

    // Must call GetAviationFile for each file to get base64
    const imageRequests = allFiles.map(file => {
      return this.apiService.GetAviationFile('winds/blockwinds', file.filename).pipe(
        catchError(() => this.apiService.GetAviationFile('winds/vectorwinds', file.filename)),
        catchError(() => of(null))
      ).toPromise().then((data: any) => {
        if(!data ||!data.filecontent) return;
        let type: 'WL'|'WH'|'ZFL' | null = null;
        if(file.filename.includes('WL')) type = 'WL';
        else if(file.filename.includes('WH')) type = 'WH';
        else if(file.filename.includes('ZFL')) type = 'ZFL';
        if(!type) return;

        const hourMatch = file.filename.match(/(12|18|24|30|36|42|48)/);
        const hour = hourMatch? hourMatch[0] : '00';
        const img = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + data.filecontent);
        this.windImages.push({hour, type, image: img, filename: file.filename});
      });
    });
    await Promise.all(imageRequests);
    console.log('Wind Images Loaded:', this.windImages.length);
  }

  getWindImage(type: 'WL'|'WH'|'ZFL', hour: string): SafeResourceUrl | null {
    if(hour === 'xx') return this.windImages.find(x => x.type === type)?.image || null;
    return this.windImages.find(x => x.type === type && x.hour === hour)?.image || null;
  }

  loadQNH(files: any[]) {
    const qnhFile = files.find((x: any) => x.filename === 'synoptic.png');
    if (!qnhFile) return;
    this.apiService.GetAviationFile('', qnhFile.filename).subscribe({
      next: (data: any) => {
        const imageUrlSynoptic = 'data:image/png;base64,' + data.filecontent;
        this.qnhImage = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlSynoptic);
        this.fileBaseUrlSynoptic = this.qnhImage;
        this.cdr.detectChanges();
      },
      error: (error) => { console.error('Error loading QNH:', error); }
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

  getAirportCode(item: any): string { return item.icao || (item.filecontent || '').match(/\b[A-Z]{4}\b/)?.[0] || ''; }
  getProvinceForStation(code: string): string { for(const [province, codes] of Object.entries(this.regionStations)) { if(codes.includes(code)) return province; } return 'Other Regions'; }
  getSelectedStations(): string[] { return this.stationCodes.trim()? this.stationCodes.split(/\s+/).map(x => x.trim().toUpperCase()) : []; }

parseReportsFromFiles(files: any[]): any[] {
  const reports: any[] = [];

  files.forEach(file => {
    let content = file.filecontent || '';
    if (!content) return;

    content = content.replace(/\u0001|\u0003/g, '');
    const lines = content.split(/\r?\n/);

    let currentReport = '';
    let currentIcao = '';

    lines.forEach((line: string) => {
      line = line.trim();
      if (!line) return;

      // Match METAR, SPECI, TAF, COR reports
      const reportMatch = line.match(/^(METAR|SPECI|TAF|COR)\s+([A-Z]{4})/);

      // Match plain METAR lines starting with ICAO
      const plainMatch = line.match(/^([A-Z]{4})\s+\d{6}Z/);

      if (reportMatch) {
        // Save previous report
        if (currentReport && currentIcao) {
          reports.push({
            ...file,
            filecontent: currentReport.trim(),
            icao: currentIcao,
            lastmodified: file.lastmodified
          });
        }

        currentReport = line;
        currentIcao = reportMatch[2];
      } else if (plainMatch) {
        // Save previous report
        if (currentReport && currentIcao) {
          reports.push({
            ...file,
            filecontent: currentReport.trim(),
            icao: currentIcao,
            lastmodified: file.lastmodified
          });
        }

        currentReport = line;
        currentIcao = plainMatch[1];
      } else if (currentReport) {
        // Continuation line for TAF
        currentReport += '\n      ' + line;
      }
    });

    // Save last report
    if (currentReport && currentIcao) {
      reports.push({
        ...file,
        filecontent: currentReport.trim(),
        icao: currentIcao,
        lastmodified: file.lastmodified
      });
    }
  });

  return reports;
}

 getLatestPerStation(files: any[]): any[] {
  const map = new Map<string, any>();

  files.forEach(f => {
    const code = this.getAirportCode(f);
    if (!code) return;

    const existing = map.get(code);

    if (
      !existing ||
      new Date(f.lastmodified || 0) > new Date(existing.lastmodified || 0)
    ) {
      map.set(code, f);
    }
  });

  return Array.from(map.values());
}
groupByProvince(files: any[]): ProvinceGroup[] {
  const selected = this.getSelectedStations();

  // Filter strictly by selected station code
  let filtered = files;

  if (selected.length > 0) {
    filtered = files.filter(f =>
      selected.includes(this.getAirportCode(f))
    );
  }

  // Only keep latest report per ICAO
  const latest = this.getLatestPerStation(filtered);

  const groups: { [key: string]: any[] } = {};

  latest.forEach(f => {
    const code = this.getAirportCode(f);
    const province = this.getProvinceForStation(code);

    if (!groups[province]) {
      groups[province] = [];
    }

    groups[province].push(f);
  });

  return Object.keys(groups)
    .sort()
    .map(province => ({
      province,
      items: groups[province].sort((a, b) =>
        this.getAirportCode(a).localeCompare(this.getAirportCode(b))
      )
    }));
}
  getLatestSigmetAirmet(files: any[]): any[] { const map = new Map<string, any>(); files.forEach(f => { const content = f.filecontent || ''; const match = content.match(/^(FA[A-Z]{2})\s+(SIGMET|AIRMET)\s+([A-Z]\d{2})/); const key = match ? `${match[1]}-${match[2]}-${match[3]}` : content.substring(0, 50); const existing = map.get(key); const newDate = new Date(f.lastmodified || 0); const oldDate = new Date(existing?.lastmodified || 0); if (!existing || newDate > oldDate) map.set(key, f); }); return Array.from(map.values()); }
  filterTakeOffData(): any[] { const stations = this.getSelectedStations(); if (stations.length === 0) return this.takeOffData; return this.takeOffData.filter(item => stations.includes(this.getAirportCode(item))); }
  generateRecordReference(): string { const now = new Date(); const hh = String(now.getUTCHours()).padStart(2, '0'); const mm = String(now.getUTCMinutes()).padStart(2, '0'); const yyyy = now.getUTCFullYear(); const MM = String(now.getUTCMonth() + 1).padStart(2, '0'); const dd = String(now.getUTCDate()).padStart(2, '0'); return `AWC-DFF-${hh}:${mm}/${yyyy}-${MM}-${dd}`; }

  async openImageViewerSymbol2() { const modal = await this.modalCtrl.create({ component: ViewSymbolPage, componentProps: { imgs: ['../../assets/sxwg.gif'] }, cssClass: 'transparent-modal' }); await modal.present(); }

viewReport() {
  try {
    this.spinner.show();
    this.reportPages = [];
    this.recordReference = this.generateRecordReference();

    // Parse all reports
    const metarParsed = this.parseReportsFromFiles(this.folderData['METAR'] || []);
    const speciParsed = this.parseReportsFromFiles(this.folderData['SPECI'] || []);
    const tafParsed = this.parseReportsFromFiles(this.folderData['Tafft'] || []);
    const sigmetParsed = this.parseReportsFromFiles(this.folderData['SIGMET'] || []);
    const airmetParsed = this.parseReportsFromFiles(this.folderData['AIRMET'] || []);

    // Get selected station codes
    const selectedStations = this.getSelectedStations();

    // Cover page
    if (this.flightSections.coverPage) {
      this.reportPages.push({ type: 'cover' });
    }

    // Content page
    this.reportPages.push({ type: 'content' });

    // =========================
    // METAR - Grouped by province, one latest per ICAO
    // =========================
    if (this.flightSections.metar) {
      const metarFiltered = selectedStations.length === 0
        ? metarParsed
        : metarParsed.filter(f =>
            selectedStations.includes(this.getAirportCode(f))
          );

      this.reportPages.push({
        type: 'text',
        title: 'METAR - Meteorological Aerodrome Report',
        data: this.groupByProvince(this.getLatestPerStation(metarFiltered))
      });
    }

    // =========================
    // SPECI - Plain list, one latest per ICAO
    // =========================
    if (this.flightSections.speci) {
      const speciFiltered = selectedStations.length === 0
        ? speciParsed
        : speciParsed.filter(f =>
            selectedStations.includes(this.getAirportCode(f))
          );

      this.reportPages.push({
        type: 'text',
        title: 'SPECI - Special Meteorological Aerodrome Report',
        data: this.getLatestPerStation(speciFiltered)
      });
    }

    // =========================
    // TAF - Grouped by province, one latest per ICAO
    // =========================
    if (this.flightSections.taf) {
      const tafFiltered = selectedStations.length === 0
        ? tafParsed
        : tafParsed.filter(f =>
            selectedStations.includes(this.getAirportCode(f))
          );

      this.reportPages.push({
        type: 'text',
        title: 'TAF - Terminal Aerodrome Forecast',
        data: this.groupByProvince(this.getLatestPerStation(tafFiltered))
      });
    }

    // AMO
    if (this.flightSections.amo) {
      this.reportPages.push({
        type: 'text',
        title: 'AMO - Aeronautical Meteorological Outlook',
        data: []
      });
    }

    // =========================
    // SIGMET / AIRMET - keep existing functionality
    // =========================
    if (this.flightSections.sigmet || this.flightSections.airmet) {
      const combined = [...sigmetParsed, ...airmetParsed];

      const filtered = selectedStations.length === 0
        ? combined
        : combined.filter(f => {
            const content = f.filecontent || '';

            // Gauteng FIR
            if (
              selectedStations.some(c =>
                ['FAOR', 'FALA', 'FAWB', 'FAWK', 'FAGC', 'FAJB'].includes(c)
              ) && content.includes('FAJA')
            ) {
              return true;
            }

            // Western Cape FIR
            if (
              selectedStations.some(c =>
                ['FACT', 'FAGG', 'FAOH', 'FALW'].includes(c)
              ) && content.includes('FACA')
            ) {
              return true;
            }

            return selectedStations.some(code => content.includes(code));
          });

      this.reportPages.push({
        type: 'text',
        title: 'Sigmet and Airmet for South African FIR',
        data: this.getLatestSigmetAirmet(filtered)
      });
    }

    // Take-off Data
    if (this.flightSections.takeoff) {
      this.reportPages.push({
        type: 'text',
        title: 'Take-off Data (Runway Parameters)',
        data: this.filterTakeOffData()
      });
    }

    // Warnings
    // Warnings - filter by selected station codes and keep one latest per ICAO
if (this.flightSections.warning) {
  const warningsParsed = this.parseReportsFromFiles(this.folderData['warnings'] || []);

  const warningsFiltered = selectedStations.length === 0
    ? warningsParsed
    : warningsParsed.filter(f =>
        selectedStations.includes(this.getAirportCode(f))
      );

  this.reportPages.push({
    type: 'text',
    title: 'Aerodrome Warning',
    data: this.getLatestPerStation(warningsFiltered)
  });
}

    // QNH Chart
    if (this.flightSections.qnh && this.qnhImage) {
      this.reportPages.push({
        type: 'image',
        title: 'QNH Chart',
        image: this.qnhImage
      });
    }

    // Wind images
    const hour = this.selectedOption2;

    if (this.flightSections.blockWindLow) {
      const img = this.getWindImage('WL', hour);
      if (img) {
        this.reportPages.push({
          type: 'image',
          title: `Block Wind FL010-240 - ${hour}H`,
          image: img
        });
      }
    }

    if (this.flightSections.blockWindHigh) {
      const img = this.getWindImage('WH', hour);
      if (img) {
        this.reportPages.push({
          type: 'image',
          title: `Block Wind FL210-450 - ${hour}H`,
          image: img
        });
      }
    }

    if (this.flightSections.barbWindLow) {
      const img = this.getWindImage('ZFL', hour);
      if (img) {
        this.reportPages.push({
          type: 'image',
          title: `Vector Wind FL010-210 - ${hour}H`,
          image: img
        });
      }
    }

    if (this.flightSections.barbWindHigh) {
      const img = this.getWindImage('ZFL', hour);
      if (img) {
        this.reportPages.push({
          type: 'image',
          title: `Vector Wind FL150-450 - ${hour}H`,
          image: img
        });
      }
    }

   // SIGWX Charts based on selected chart hour
const chartHour = this.selectedOption3;

if (this.flightSections.addLow) {
  const img = this.getSigwxImage('sigwxm', chartHour);
  if (img) {
    this.reportPages.push({
      type: 'image',
      title: `ADD Low SIGWX - ${chartHour === 'xx' ? 'Latest' : chartHour + ':00'}`,
      image: img
    });
  }
}

if (this.flightSections.lowSigwx) {
  const img = this.getSigwxImage('sigwxl', chartHour);
  if (img) {
    this.reportPages.push({
      type: 'image',
      title: `LOW SIGWX - ${chartHour === 'xx' ? 'Latest' : chartHour + ':00'}`,
      image: img
    });
  }
}

if (this.flightSections.highSigwx) {
  const img = this.getSigwxImage('sigwxh', chartHour);
  if (img) {
    this.reportPages.push({
      type: 'image',
      title: `HIGH SIGWX - ${chartHour === 'xx' ? 'Latest' : chartHour + ':00'}`,
      image: img
    });
  }
}

    if (this.flightSections.symbols) {
      this.reportPages.push({
        type: 'image',
        title: 'Symbols',
        image: this.sanitizer.bypassSecurityTrustResourceUrl('../../assets/sxwg.gif')
      });
    }

    this.showReport = true;

  } catch (err) {
    console.error('viewReport crashed', err);
    this.showReport = false;
  } finally {
    setTimeout(() => {
      this.spinner.hide();
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    }, 100);
  }
}
getSigwxImage(type: 'sigwxh' | 'sigwxm' | 'sigwxl', hour: string): SafeResourceUrl | null {
  // If no hour is selected, return the most recent image of that type
  if (hour === 'xx') {
    const latest = this.windImages
      .filter(x => x.filename.toLowerCase().includes(type))
      .sort((a, b) => b.filename.localeCompare(a.filename))[0];

    return latest ? latest.image : null;
  }

  // Find the image matching the selected hour
  const image = this.windImages.find(
    x =>
      x.filename.toLowerCase().includes(type) &&
      x.filename.includes(hour)
  );

  return image ? image.image : null;
  }
  
  async downloadPDF() {
  const reportElement = document.querySelector('.report-viewer') as HTMLElement;

  if (!reportElement) {
    console.error('Report viewer not found');
    return;
  }

  this.spinner.show();

  try {
    // Capture the visible report
    const canvas = await html2canvas(reportElement, {
      scale: 2, // better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Additional pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save PDF
    pdf.save(`Aviation_Weather_Report_${this.reportDate.toISOString().slice(0,10)}.pdf`);

  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    this.spinner.hide();
  }
  }
  
  closeAllDropdowns() {
  this.isDropdownOpen2 = false;
  this.isDropdownOpen3 = false;
  this.isDropdownOpen4 = false;
  this.isDropdownOpen6 = false;
}
  closeReport() { this.showReport = false; }
  isGroupedReport(page: ReportPage): boolean { const t = page.title || ''; return t.includes('METAR') || t.includes('TAF') || t.includes('SPECI'); }
}