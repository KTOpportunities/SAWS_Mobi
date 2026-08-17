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
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import html2canvas from 'html2canvas';

interface ReportPage {
  type: 'cover' | 'content' | 'text' | 'image';
  title?: string;
  data?: any[];
  image?: SafeResourceUrl | null;
  imageBase64?: string;
}

interface ProvinceGroup { province: string; items: any[]; }

interface WindImage {
  hour: string;
  type: 'WL' | 'WH' | 'ZFLL' | 'ZFLH' | 'sigwxh' | 'sigwxm' | 'sigwxl';
  image: SafeResourceUrl;
  base64: string;
  filename: string;
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
  windImages: WindImage[] = [];

  stationCodes: string = '';
  filteredStations: string[] = [];
  selectedOption4: string = 'All Regions';
  selectedOption6: string = 'Select Station';
  selectedOption2: string = 'xx';
  selectedOption3: string = '03';

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
  sigwxData: any[] = [];

  domesticStations: string[] = [
    'FAOR - Johannesburg (OR Tambo)','FALA - Johannesburg (Lanseria)','FAGC - Grand Central','FARF - Rand Airport','FAWK - Waterkloof','FAWB - Wonderboom','FAJB - Johannesburg',
    'FACT - Cape Town','FAGG - George','FAOH - Oudtshoorn','FALW - Langebaanweg','FAWC - Worcester',
    'FASB - Springbok','FAVR - Vredendal','FABY - Beaufort West',
    'FAPE - Port Elizabeth (Gqeberha)','FAEL - East London','FAMT - Mthatha','FABE - Bhisho','FAUT - Queenstown',
    'FABL - Bloemfontein','FABM - Bethlehem','FAFB - Ficksburg','FAHR - Harrismith','FATN - Thaba Nchu','FAWM - Welkom','FAHV - Virginia','FAKS - Kroonstad',
    'FALE - Durban (King Shaka)','FAPM - Pietermaritzburg','FARB - Richards Bay','FAMG - Margate','FAGY - Greytown','FAUL - Ulundi','FALY - Ladysmith','FANC - Newcastle','FAMX - Mkuze',
    'FAPP - Polokwane','FAAL - Alldays','FAGI - Giyani','FALM - Louis Trichardt','FAMS - Musina','FATZ - Tzaneen','FAPH - Phalaborwa','FAHS - Hoedspruit','FATI - Thohoyandou','FAER - Lephalale',
    'FANS - Nelspruit','FAEO - Ermelo','FASR - Standerton','FAWI - eMalahleni (Witbank)','FAKN - Nelspruit','FAKP - Kruger Mpumalanga','FASZ - Skukuza',
    'FAMM - Mahikeng','FAPN - Pilanesberg','FARY - Rustenburg','FAKG - Klerksdorp','FAKD - Klerksdorp','FALI - Lichtenburg','FAPS - Potchefstroom',
    'FAUP - Upington','FAKM - Kimberley','FAAB - Alexander Bay','FAAG - Aggeneys','FASP - Springbok','FASS - Sishen','FAKU - Kuruman','FACV - Calvinia','FADY - De Aar',
    'FXMM - Maseru (Moshoeshoe I)','FDMS - Matsapha','FDSK - King Mswati III International',
    'FBSK - Gaborone (Sir Seretse Khama)','FBMN - Maun','FBKE - Kasane','FBFR - Francistown','FBGZ - Ghanzi','FBPY - Palapye',
    'FYWH - Windhoek (Hosea Kutako)','FYWE - Windhoek (Eros)','FYKM - Keetmanshoop','FYKT - Katima Mulilo','FYWB - Walvis Bay','FYGF - Grootfontein','FYLZ - Luderitz','FYOA - Ondangwa','FYOG - Oranjemund','FYRU - Rundu',
    'FQMA - Maputo','FQBR - Beira','FQNP - Nampula','FQIN - Inhambane','FQLC - Lichinga','FQPB - Pemba','FQQL - Quelimane','FQTT - Tete','FQVL - Vilanculos','FQCH - Chimoio','FQNC - Nacala',
    'FVRG - Harare','FVJN - Bulawayo (Joshua Mqabuko)','FVFA - Victoria Falls','FVBU - Buffalo Range','FVMU - Mutare',
    'FLKK - Lusaka (KKIA)','FLHN - Ndola','FLND - Ndola','FLSK - Livingstone','FLSO - Solwezi','FLKE - Kasama',
    'FWKI - Lilongwe','FWCL - Blantyre (Chileka)','FWMY - Mzuzu',
    'FNLU - Luanda (Quatro de Fevereiro)','FNBN - Benguela','FNCA - Cabinda','FNHU - Huambo','FNMG - Menongue','FNNL - Namibe','FNSA - Saurimo','FAME - Ermelo'
  ];

  regions: string[] = [
    "All Regions",'Gauteng','Limpopo','Mpumalanga','North West','Free State','KwaZulu Natal','Northern Cape','Western Cape','Eastern Cape',
    'Lesotho','Eswatini','Botswana','Namibia','Mozambique','Zimbabwe','Zambia','Malawi','Angola','Other Regions','Other Stations'
  ];

 regionStations: { [key: string]: string[] } = {

  // =========================
  // SOUTH AFRICA
  // =========================

  'Gauteng': [
    'FAOR', // Johannesburg OR Tambo
    'FALA', // Lanseria
    'FAGC', // Grand Central
    'FARF', // Rand
    'FAWK', // Waterkloof
    'FAWB', // Wonderboom
    'FAJB'  // Johannesburg
  ],

  'Western Cape': [
    'FACT', // Cape Town
    'FAGG', // George
    'FAOH', // Oudtshoorn
    'FALW', // Langebaanweg
    'FAWC', // Worcester
    'FAVR', // Vredendal
    'FABY'  // Beaufort West
  ],

  'Eastern Cape': [
    'FAPE', // Port Elizabeth
    'FAEL', // East London
    'FAMT', // Mthatha
    'FABE', // Bhisho
    'FAUT'  // Queenstown
  ],

  'Free State': [
    'FABL', // Bloemfontein
    'FABM', // Bethlehem
    'FAFB', // Ficksburg
    'FAHR', // Harrismith
    'FATN', // Thaba Nchu
    'FAWM', // Welkom
    'FAHV', // Virginia
    'FAKS'  // Kroonstad
  ],

  'KwaZulu Natal': [
    'FALE', // King Shaka
    'FAPM', // Pietermaritzburg
    'FARB', // Richards Bay
    'FAMG', // Margate
    'FAGY', // Greytown
    'FAUL', // Ulundi
    'FALY', // Ladysmith
    'FANC', // Newcastle
    'FAMX'  // Mkuze
  ],

  'Limpopo': [
    'FAPP', // Polokwane
    'FAAL', // Alldays
    'FAGI', // Giyani
    'FALM', // Louis Trichardt
    'FAMS', // Musina
    'FATZ', // Tzaneen
    'FAPH', // Phalaborwa
    'FAHS', // Hoedspruit
    'FATI', // Thohoyandou
    'FAER'  // Lephalale
  ],

  'Mpumalanga': [
    'FANS', // Nelspruit
    'FAEO', // Ermelo
    'FASR', // Standerton
    'FAWI', // eMalahleni
    'FAKN', // Nelspruit
    'FAKP', // Kruger Mpumalanga
    'FASZ'  // Skukuza
  ],

  'North West': [
    'FAMM', // Mahikeng
    'FAPN', // Pilanesberg
    'FARY', // Rustenburg
    'FAKG', // Klerksdorp
    'FAKD', // Klerksdorp
    'FALI', // Lichtenburg
    'FAPS'  // Potchefstroom
  ],

  'Northern Cape': [
    'FAUP', // Upington
    'FAKM', // Kimberley
    'FAAB', // Alexander Bay
    'FAAG', // Aggeneys
    'FASP', // Springbok
    'FASS', // Sishen
    'FAKU', // Kuruman
    'FACV', // Calvinia
    'FADY'  // De Aar
  ],

  // =========================
  // NEIGHBOURING COUNTRIES
  // =========================

  'Lesotho': [
    'FXMM' // Maseru
  ],

  'Eswatini': [
    'FDMS', // Matsapha
    'FDSK'  // King Mswati III International
  ],

  'Botswana': [
    'FBSK', // Gaborone
    'FBMN', // Maun
    'FBKE', // Kasane
    'FBFR', // Francistown
    'FBGZ', // Ghanzi
    'FBPY'  // Palapye
  ],

  'Namibia': [
    'FYWH', // Windhoek Hosea Kutako
    'FYWE', // Windhoek Eros
    'FYKM', // Keetmanshoop
    'FYKT', // Katima Mulilo
    'FYWB', // Walvis Bay
    'FYGF', // Grootfontein
    'FYLZ', // Luderitz
    'FYOA', // Ondangwa
    'FYOG', // Oranjemund
    'FYRU'  // Rundu
  ],

  'Mozambique': [
    'FQMA', // Maputo
    'FQBR', // Beira
    'FQNP', // Nampula
    'FQIN', // Inhambane
    'FQLC', // Lichinga
    'FQPB', // Pemba
    'FQQL', // Quelimane
    'FQTT', // Tete
    'FQVL', // Vilanculos
    'FQCH', // Chimoio
    'FQNC'  // Nacala
  ],

  'Zimbabwe': [
    'FVRG', // Harare
    'FVJN', // Bulawayo
    'FVFA', // Victoria Falls
    'FVBU', // Buffalo Range
    'FVMU'  // Mutare
  ],

  // 'Zambia': [
  //   'FLKK', // Lusaka
  //   'FLHN', // Ndola
  //   'FLND', // Ndola
  //   'FLSK', // Livingstone
  //   'FLSO', // Solwezi
  //   'FLKE'  // Kasama
  // ],

  // 'Malawi': [
  //   'FWKI', // Lilongwe
  //   'FWCL', // Blantyre
  //   'FWMY'  // Mzuzu
  // ],

  // 'Angola': [
  //   'FNLU', // Luanda
  //   'FNBN', // Benguela
  //   'FNCA', // Cabinda
  //   'FNHU', // Huambo
  //   'FNMG', // Menongue
  //   'FNNL', // Namibe
  //   'FNSA'  // Saurimo
  // ],

  // =========================
  // OTHER / UNMAPPED
  // =========================

  'Other Stations': [
    'FAME' // Ermelo
  ]

};

  constructor(private router: Router, private authService: AuthService, private spinner: NgxSpinnerService, private apiService: APIService, private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef, private modalCtrl: ModalController) {}

  async ngOnInit() { 
  if (!this.authService.getIsLoggedIn()) this.router.navigate(['/login']); 
  else {
    if(Capacitor.getPlatform() === 'android') {
      await Filesystem.requestPermissions();
    }
    this.loadAllFolders(); 
  } 
  this.filteredStations = this.domesticStations; 
}
  NavigateToDomestic() { this.router.navigate(['/domestic']); }

  toggleDropdown(dropdown: string, event?: Event) {
    event?.stopPropagation();
    this.isDropdownOpen2 = dropdown === 'dropdown2'?!this.isDropdownOpen2 : false;
    this.isDropdownOpen3 = dropdown === 'dropdown3'?!this.isDropdownOpen3 : false;
    this.isDropdownOpen4 = dropdown === 'dropdown4'?!this.isDropdownOpen4 : false;
    this.isDropdownOpen6 = dropdown === 'dropdown6'?!this.isDropdownOpen6 : false;
  }
  toggleSelectAll() {
    const selectAll = this.flightSections.selectAll;
    Object.keys(this.flightSections).forEach((key: string) => { (this.flightSections as any)[key] = selectAll; });
  }
  selectOption2(option: string, event?: Event) {
    event?.stopPropagation(); this.selectedOption2 = option; this.closeAllDropdowns();
    if (option!== 'xx') { this.flightSections.blockWindLow = true; this.flightSections.blockWindHigh = true; this.flightSections.barbWindLow = true; this.flightSections.barbWindHigh = true; }
  }
  selectOption3(option: string, event?: Event) { event?.stopPropagation(); this.selectedOption3 = option; this.closeAllDropdowns(); }
  selectRegion(region: string, event?: Event) {
    event?.stopPropagation(); this.selectedOption4 = region; this.closeAllDropdowns(); this.selectedOption6 = 'Select Station';
    if (region === 'All Regions') { this.filteredStations = [...this.domesticStations]; this.stationCodes = this.domesticStations.map(station => station.split(' - ')[0]).join(' '); return; }
    const codes = this.regionStations[region] || []; this.filteredStations = this.domesticStations.filter(station => codes.includes(station.split(' - ')[0])); this.stationCodes = codes.join(' ');
  }
  selectStation(station: string, event?: Event) { event?.stopPropagation(); this.selectedOption6 = station; this.closeAllDropdowns(); const code = station.split(' - ')[0]; this.stationCodes = code; }
  clearStations() { this.stationCodes = ''; this.selectedOption4 = 'All Regions'; this.selectedOption6 = 'Select Station'; this.filteredStations = [...this.domesticStations]; }
  sortStations() { if (!this.stationCodes.trim()) return; this.stationCodes = this.stationCodes.split(/\s+/).filter(c => c).sort().join(' '); }

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
    aviationFiles: this.apiService.GetSourceAviationFolderFilesListNull().pipe(catchError(() => of([]))),
    winds: this.apiService.GetSourceAviationFolderFilesList('winds/blockwinds').pipe(catchError(() => of([]))),
    vector: this.apiService.GetSourceAviationFolderFilesList('winds/vectorwinds').pipe(catchError(() => of([])))
  }).subscribe({
    next: (res) => {
      this.folderData['METAR'] = res.metar;
      this.folderData['SPECI'] = res.speci;
      this.folderData['Tafft'] = res.taf;
      this.folderData['SIGMET'] = res.sigmet;
      this.folderData['AIRMET'] = res.airmet;
      this.folderData['warnings'] = res.warnings;
      this.windsData = res.winds || [];
      this.vectorData = res.vector || [];

      // SIGWX: filter first like sigwx-charts.component
      this.sigwxData = (res.aviationFiles || []).filter((item: any) => {
        const fname = item.filename.toLowerCase();
        return fname.startsWith('sigwxh') || fname.startsWith('sigwxm') || fname.startsWith('sigwxl');
      });

      this.sigwxData = this.sortSigwxImages(this.sigwxData);

      this.processTakeOffData(res.takeoff);
      this.loadQNH(res.aviationFiles);
      this.processWindImages(); // now fetches content
      this.loading = false; this.spinner.hide(); this.cdr.detectChanges();
    },
    error: err => { console.error(err); this.loading = false; this.spinner.hide(); }
  });
}

async processWindImages(): Promise<void> {
  this.windImages = [];
  const windFiles = [...this.windsData,...this.vectorData];

  // 1. Block/Vector winds - same as before
  const requests = windFiles.map(async (file: any) => {
    const folder = this.vectorData.includes(file)? 'winds/vectorwinds' : 'winds/blockwinds';
    try {
      const data: any = await this.apiService.GetAviationFile(folder, file.filename).pipe(catchError(() => of(null))).toPromise();
      if (!data?.filecontent) return;
      const fname = file.filename.toLowerCase();
      let type: 'WL' | 'WH' | 'ZFLL' | 'ZFLH' | null = null;
      if (fname.includes('wl')) type = 'WL';
      else if (fname.includes('wh')) type = 'WH';
      else if (fname.includes('zfl')) { type = (fname.includes('010') || fname.includes('210') || fname.includes('low'))? 'ZFLL' : 'ZFLH'; }
      if (!type) return;
      const hour = fname.match(/(00|06|12|18|24|30|36|42|48)/)?.[1]?? '00';
      const base64 = 'data:image/png;base64,' + data.filecontent;
      this.windImages.push({ hour, type, filename: file.filename, base64, image: this.sanitizer.bypassSecurityTrustResourceUrl(base64) });
    } catch (e) { console.error(file.filename, e); }
  });
  await Promise.all(requests);

  // 2. SIGWX - fetch each file like sigwx-charts.component
  const sigwxRequests = this.sigwxData.map(async (file: any) => {
    try {
      const folder = file.folder || file.foldername || ''; // your API uses foldername
      const data: any = await this.apiService.GetAviationFile(folder, file.filename).pipe(catchError(() => of(null))).toPromise();
      if (!data?.filecontent) return;
      const fname = file.filename.toLowerCase();
      let type: 'sigwxh' | 'sigwxm' | 'sigwxl' | null = null;
      if (fname.startsWith('sigwxh')) type = 'sigwxh';
      else if (fname.startsWith('sigwxm')) type = 'sigwxm';
      else if (fname.startsWith('sigwxl')) type = 'sigwxl';
      if (!type) return;

      const hourLabel = this.extractSigwxTime(file, type); // '00:00' or 'A4-size images'
      const hour = hourLabel === 'A4-size images'? 'xx' : hourLabel.split(':')[0];

      const base64 = 'data:image/png;base64,' + data.filecontent;
      this.windImages.push({ hour, type, filename: file.filename, base64, image: this.sanitizer.bypassSecurityTrustResourceUrl(base64) });
    } catch (e) { console.error('SIGWX load error', file.filename, e); }
  });
  await Promise.all(sigwxRequests);
  console.table(this.windImages.filter(x => x.type.includes('sigwx')).map(x => ({type: x.type, hour: x.hour, file: x.filename})));
}
extractSigwxTime(item: any, prefix: string): string {
  const fname = item.filename.toLowerCase();
  if (fname.endsWith('xx.png')) return 'A4-size images';
  const hourStr = fname.slice(prefix.length, -4);
  const hour = parseInt(hourStr, 10);
  if (!isNaN(hour)) return hour < 10? `0${hour}:00` : `${hour}:00`;
  return 'most recent';
}

sortSigwxImages(items: any[]): any[] {
  const order = ['most recent','A4-size images','00:00','03:00','06:00','09:00','12:00','15:00','18:00','21:00'];
  return items
   .map(item => {
      let prefix = '';
      if(item.filename.toLowerCase().startsWith('sigwxh')) prefix = 'sigwxh';
      else if(item.filename.toLowerCase().startsWith('sigwxm')) prefix = 'sigwxm';
      else if(item.filename.toLowerCase().startsWith('sigwxl')) prefix = 'sigwxl';
      return {...item, timeLabel: this.extractSigwxTime(item, prefix)}
    })
   .filter(item => item.timeLabel)
   .sort((a, b) => order.indexOf(a.timeLabel!) - order.indexOf(b.timeLabel!));
}
getWindImage(type: WindImage['type'], hour: string): WindImage | null {
  let candidates = this.windImages.filter(x => x.type === type);
  if (candidates.length === 0) return null;
  if (hour === 'xx') {
    // return latest. Treat xx as 99
    candidates.sort((a,b) => { const ha = a.hour === 'xx'? 99 : Number(a.hour); const hb = b.hour === 'xx'? 99 : Number(b.hour); return hb - ha; });
    return candidates[0];
  }
  return candidates.find(x => x.hour === hour) || null;
}

  loadQNH(files: any[]) {
    const qnhFile = files.find((x: any) => x.filename?.toLowerCase().includes('synoptic') || x.filename?.toLowerCase().includes('qnh'));
    if (!qnhFile) return;
    const folder = qnhFile.folder || '';
    this.apiService.GetAviationFile(folder, qnhFile.filename).subscribe({
      next: (data: any) => {
        if(!data?.filecontent) return;
        const imageUrlSynoptic = 'data:image/png;base64,' + data.filecontent;
        this.qnhImage = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlSynoptic);
        this.fileBaseUrlSynoptic = this.qnhImage; this.cdr.detectChanges();
      },
      error: (error) => { console.error('[QNH] Error loading QNH:', error); }
    });
  }

  processTakeOffData(response: any[]) {
    if (!response) { this.takeOffData = []; return; }
    const airportMap = response.reduce((acc: any, item: any) => {
      const airportCode = this.getAirportCode(item);
      if (!acc[airportCode] || new Date(item.lastmodified) > new Date(acc[airportCode].lastmodified)) { acc[airportCode] = item; }
      return acc;
    }, {});
    this.takeOffData = Object.values(airportMap).filter((item: any) => item.filecontent.includes('TAKE-OFF'));
  }

  getAirportCode(item: any): string { return item.icao || (item.filecontent || '').match(/\b[A-Z]{4}\b/)?.[0] || ''; }
  getProvinceForStation(code: string): string { for(const [province, codes] of Object.entries(this.regionStations)) { if(codes.includes(code)) return province; } return 'Other Regions'; }
  getSelectedStations(): string[] { return this.stationCodes.trim()? this.stationCodes.split(/\s+/).map(x => x.trim().toUpperCase()) : []; }

  parseReportsFromFiles(files: any[], type: string = ''): any[] {
    const reports: any[] = [];
    files.forEach((file) => {
      let content = file.filecontent || file.content || '';
      if (!content) return;
      content = content.replace(/\u0001|\u0003/g, '').trim();
      if (type === 'METAR') { const metarIndex = content.search(/\bMETAR\b/i); if (metarIndex > 0) content = content.substring(metarIndex); }
      let rawReports: string[] = [];
      if (type === 'SIGMET' || type === 'AIRMET') {
        rawReports = content.split('=').map((r: string) => r.trim()).filter((r:string): r is string => r.length > 0).map((r: string )=> r + '=');
      } else {
        rawReports = content.split(/(?==\s*\r?\n?)/).map((r: string) => r.trim()).filter((r:string): r is string => r.length > 0);
      }
      rawReports.forEach((raw: string) => {
        const noDataMatch = raw.match(/^([A-Z]{4})\s+NO\s+DATA/i);
        if (noDataMatch) { reports.push({...file, filecontent: raw, icao: noDataMatch[1], lastmodified: file.lastmodified }); return; }
        let icao = '';
        if (type === 'SIGMET' || type === 'AIRMET') { const sigMatch = raw.match(/(FA[A-Z]{2})\s+(SIGMET|AIRMET)/i); if (sigMatch) icao = sigMatch[1].toUpperCase(); }
        else { const icaoMatch = raw.match(/(?:METAR|SPECI|TAF|COR)(?:\s+AMD)?\s+([A-Z]{4})/i) || raw.match(/^([A-Z]{4})\s+\d{6}Z/); if (icaoMatch) icao = icaoMatch[1].toUpperCase(); }
        reports.push({...file, filecontent: raw, icao, lastmodified: file.lastmodified });
      });
    });
    return reports;
  }

  getLatestPerStation(files: any[]): any[] {
    const map = new Map<string, any>(); files.forEach(f => { const code = this.getAirportCode(f); if (!code) return; const existing = map.get(code); if (!existing || new Date(f.lastmodified || 0) > new Date(existing.lastmodified || 0)) { map.set(code, f); } }); return Array.from(map.values());
  }
  groupByProvince(files: any[]): ProvinceGroup[] {
    const selected = this.getSelectedStations(); let filtered = files;
    if (selected.length > 0) { filtered = files.filter(f => selected.includes(this.getAirportCode(f))); }
    const latest = this.getLatestPerStation(filtered); const groups: { [key: string]: any[] } = {};
    latest.forEach(f => { const code = this.getAirportCode(f); const province = this.getProvinceForStation(code); if (!groups[province]) { groups[province] = []; } groups[province].push(f); });
    return Object.keys(groups).sort().map(province => ({ province, items: groups[province].sort((a, b) => this.getAirportCode(a).localeCompare(this.getAirportCode(b))) }));
  }
  getLatestSigmetAirmet(files: any[]): any[] { const map = new Map<string, any>(); files.forEach(f => { const content = f.filecontent || ''; const match = content.match(/^(FA[A-Z]{2})\s+(SIGMET|AIRMET)\s+([A-Z]\d{2})/); const key = match? `${match[1]}-${match[2]}-${match[3]}` : content.substring(0, 50); const existing = map.get(key); const newDate = new Date(f.lastmodified || 0); const oldDate = new Date(existing?.lastmodified || 0); if (!existing || newDate > oldDate) map.set(key, f); }); return Array.from(map.values()); }
  filterTakeOffData(): any[] { const stations = this.getSelectedStations(); if (stations.length === 0) return this.takeOffData; return this.takeOffData.filter(item => stations.includes(this.getAirportCode(item))); }
  generateRecordReference(): string { const now = new Date(); const hh = String(now.getUTCHours()).padStart(2, '0'); const mm = String(now.getUTCMinutes()).padStart(2, '0'); const yyyy = now.getUTCFullYear(); const MM = String(now.getUTCMonth() + 1).padStart(2, '0'); const dd = String(now.getUTCDate()).padStart(2, '0'); return `AWC-DFF-${hh}:${mm}/${yyyy}-${MM}-${dd}`; }
  async openImageViewerSymbol2() { const modal = await this.modalCtrl.create({ component: ViewSymbolPage, componentProps: { imgs: ['../../assets/sxwg.gif'] }, cssClass: 'transparent-modal' }); await modal.present(); }

viewReport() {
  try {
      this.loading = true;
    this.spinner.show(); this.reportPages = []; this.recordReference = this.generateRecordReference();
    const metarParsed = this.parseReportsFromFiles(this.folderData['METAR'] || [], 'METAR');
    const speciParsed = this.parseReportsFromFiles(this.folderData['SPECI'] || [], 'SPECI');
    const tafParsed = this.parseReportsFromFiles(this.folderData['Tafft'] || [], 'TAF');
    const sigmetParsed = this.parseReportsFromFiles(this.folderData['SIGMET'] || [], 'SIGMET');
    const airmetParsed = this.parseReportsFromFiles(this.folderData['AIRMET'] || [], 'AIRMET');
    const selectedStations = this.getSelectedStations();
    if (this.flightSections.coverPage) this.reportPages.push({ type: 'cover' });
    this.reportPages.push({ type: 'content' });
    if (this.flightSections.metar) this.reportPages.push({ type: 'text', title: 'METAR - Meteorological Aerodrome Report', data: this.groupByProvince(selectedStations.length === 0? metarParsed : metarParsed.filter(x => selectedStations.includes(this.getAirportCode(x)))) });
    if (this.flightSections.speci) this.reportPages.push({ type: 'text', title: 'SPECI - Special Meteorological Aerodrome Report', data: this.groupByProvince(selectedStations.length === 0? speciParsed : speciParsed.filter(x => selectedStations.includes(this.getAirportCode(x)))) });
    if (this.flightSections.taf) this.reportPages.push({ type: 'text', title: 'TAF - Terminal Aerodrome Forecast', data: this.groupByProvince(selectedStations.length === 0? tafParsed : tafParsed.filter(x => selectedStations.includes(this.getAirportCode(x)))) });
    if (this.flightSections.amo) this.reportPages.push({ type: 'text', title: 'AMO - Aeronautical Meteorological Outlook', data: [] });
    if (this.flightSections.sigmet || this.flightSections.airmet) {
      let combined = [...sigmetParsed,...airmetParsed];
      if (selectedStations.length > 0) {
        const wantsFAJA = selectedStations.some(code => ['FAOR','FALA','FAWB','FAWK','FAGC','FAJB','FAPP','FANS','FAKN','FALE','FABL'].includes(code));
        const wantsFACA = selectedStations.some(code => ['FACT','FAGG','FAOH','FALW','FAPE','FAEL','FAUP','FAKM'].includes(code));
        combined = combined.filter(report => { const text = (report.filecontent || '').toUpperCase(); if (wantsFAJA && text.includes('FAJA')) return true; if (wantsFACA && text.includes('FACA')) return true; return false; });
      }
      this.reportPages.push({ type: 'text', title: 'SIGMET / AIRMET', data: this.formatSigmetAirmetReports(combined) });
    }
    if (this.flightSections.takeoff) this.reportPages.push({ type: 'text', title: 'Take-off Data (Runway Parameters)', data: this.filterTakeOffData() });
    if (this.flightSections.warning) {
      const warnings = this.parseReportsFromFiles(this.folderData['warnings'] || [], 'WARNING');
      const data = selectedStations.length === 0? warnings : warnings.filter(x => selectedStations.includes(this.getAirportCode(x)));
      this.reportPages.push({ type: 'text', title: 'Aerodrome Warning', data: this.getLatestPerStation(data) });
    }
    if (this.flightSections.qnh && this.qnhImage) this.reportPages.push({ type: 'image', title: 'QNH Chart', image: this.qnhImage, imageBase64: (this.qnhImage as any)?.changingThisBreaksApplicationSecurity });

    const hour = this.selectedOption2;
    const wl = this.getWindImage('WL', hour); if (this.flightSections.blockWindLow && wl) this.reportPages.push({ type: 'image', title: `Block Wind FL010-240 - ${hour}H`, image: wl.image, imageBase64: wl.base64 });
    const wh = this.getWindImage('WH', hour); if (this.flightSections.blockWindHigh && wh) this.reportPages.push({ type: 'image', title: `Block Wind FL210-450 - ${hour}H`, image: wh.image, imageBase64: wh.base64 });
    const zfll = this.getWindImage('ZFLL', hour); if (this.flightSections.barbWindLow && zfll) this.reportPages.push({ type: 'image', title: `Vector Wind FL010-210 - ${hour}H`, image: zfll.image, imageBase64: zfll.base64 });
    const zflh = this.getWindImage('ZFLH', hour); if (this.flightSections.barbWindHigh && zflh) this.reportPages.push({ type: 'image', title: `Vector Wind FL150-450 - ${hour}H`, image: zflh.image, imageBase64: zflh.base64 });
    const chartHour = this.selectedOption3;
    const addLow = this.getWindImage('sigwxm', chartHour); if (this.flightSections.addLow && addLow) this.reportPages.push({ type: 'image', title: `ADD Low SIGWX - ${chartHour === 'xx'? 'Latest' : chartHour + ':00'}`, image: addLow.image, imageBase64: addLow.base64 });
    const low = this.getWindImage('sigwxl', chartHour); if (this.flightSections.lowSigwx && low) this.reportPages.push({ type: 'image', title: `LOW SIGWX - ${chartHour === 'xx'? 'Latest' : chartHour + ':00'}`, image: low.image, imageBase64: low.base64 });
    const high = this.getWindImage('sigwxh', chartHour); if (this.flightSections.highSigwx && high) this.reportPages.push({ type: 'image', title: `HIGH SIGWX - ${chartHour === 'xx'? 'Latest' : chartHour + ':00'}`, image: high.image, imageBase64: high.base64 });

    // FIX: Convert asset to base64 or skip. Relative paths break on mobile
    if (this.flightSections.symbols) {
      // Option A: Skip symbols on mobile. Option B: convert sxwg.gif to base64 string and paste here
      console.warn('Symbols skipped in PDF. Convert to base64 to include');
    }

    this.showReport = true;
  } catch (err) { console.error(err); this.showReport = false; }
  finally { setTimeout(() => {   this.loading = false;this.spinner.hide(); this.cdr.detectChanges(); window.scrollTo(0, 0); }, 100); }
}

 formatSigmetAirmetReports(files: any[]): any[] {
  const firMapping: { [key: string]: string } = {
    'FACA CAPE TOWN FIR': 'FACA (CAPE TOWN FIR)',
    'FAJO JOHANNESBURG OCEANIC FIR': 'FAJO (JOHANNESBURG OCEANIC FIR)',
    'FAJA JOHANNESBURG FIR': 'FAJA (JOHANNESBURG FIR)',
  };
  const sortedFirs = Object.keys(firMapping).sort((a, b) => b.length - a.length);

  const reports = this.getLatestSigmetAirmet(files);
  return reports.map(report => {
    let content = (report.filecontent || report.content || '').toUpperCase();
    const afterFaor = content.split('FAOR-')[1] || '';
    const firKey = sortedFirs.find(fir => new RegExp(`\\b${fir}\\b`).test(afterFaor));
    const heading = firKey? firMapping[firKey] : 'Unknown FIR';
    return { heading, filecontent: report.filecontent };
  }).filter(r => r.heading!== 'Unknown FIR');
}


async downloadPDF(): Promise<void> {
  this.loading = true;
  this.spinner.show();

  try {
    // 1. BUILD REPORTPAGES FIRST if not already built
    if (!this.showReport || this.reportPages.length === 0) {
      this.viewReport(); // this fills this.reportPages
      // wait 1 tick for angular to finish
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    if (this.reportPages.length === 0) {
      alert('No data to generate report.');
      return;
    }

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    const pageWidth = pdf.internal.pageSize.getWidth(); 
    const pageHeight = pdf.internal.pageSize.getHeight(); 
    const margin = 12; 
    let y = margin;

    const reportDate = `${this.reportDate.toISOString().slice(0, 10)} ${this.reportDate.toISOString().slice(11, 19)} UTC`;

    const drawHeader = () => { 
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(14); 
      pdf.text('South African Weather Service', pageWidth / 2, y, { align: 'center' }); y += 6; 
      pdf.setFontSize(11); pdf.text('Aviation Weather Centre', pageWidth / 2, y, { align: 'center' }); y += 5; 
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); 
      pdf.text('Aeronautical Meteorological Documentation', pageWidth / 2, y, { align: 'center' }); y += 4; 
      pdf.text(`Generated: ${reportDate}`, margin, y); 
      pdf.text(`Reference: ${this.recordReference?? ''}`, pageWidth - margin, y, { align: 'right' }); y += 4; 
      pdf.line(margin, y, pageWidth - margin, y); y += 6; 
    };
    
    const drawFooter = () => { 
      const pageNo = pdf.getCurrentPageInfo().pageNumber; 
      pdf.setFontSize(8); pdf.setFont('helvetica', 'normal'); 
      pdf.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12); 
      pdf.text(`Page ${pageNo}`, pageWidth / 2, pageHeight - 6, { align: 'center' }); 
    };
    
    const ensureSpace = (height: number) => { 
      if (y + height > pageHeight - 18) { 
        drawFooter(); pdf.addPage(); y = margin; drawHeader(); 
      } 
    };

    drawHeader();
    
    for (let i = 0; i < this.reportPages.length; i++) {
      const page = this.reportPages[i];
      if (i!== 0) { drawFooter(); pdf.addPage(); y = margin; drawHeader(); }

      if (page.type === 'cover') { 
        y += 35; pdf.setFont('helvetica', 'bold'); pdf.setFontSize(22); 
        pdf.text('AVIATION WEATHER REPORT', pageWidth / 2, y, { align: 'center' }); y += 18; 
        pdf.setFont('helvetica', 'normal'); pdf.setFontSize(12); 
        pdf.text('South African Weather Service', pageWidth / 2, y, { align: 'center' }); y += 8; 
        pdf.text('Aviation Weather Centre', pageWidth / 2, y, { align: 'center' }); y += 8; 
        pdf.text(reportDate, pageWidth / 2, y, { align: 'center' }); y += 10; 
        pdf.text(String(this.recordReference?? ''), pageWidth / 2, y, { align: 'center' }); 
        continue; 
      }

      if (page.type === 'content') { 
        pdf.setFont('helvetica', 'bold'); pdf.setFontSize(16); pdf.text('Contents', margin, y); y += 10; 
        pdf.setFont('helvetica', 'normal'); pdf.setFontSize(10); 
        let section = 1; 
        this.reportPages.forEach(p => { 
          if (p.type!== 'cover' && p.type!== 'content') { 
            ensureSpace(6); pdf.text(`${section}. ${String(p.title?? '')}`, margin, y); y += 6; section++; 
          } 
        }); 
        continue; 
      }

      if (page.type === 'text') { 
        pdf.setFont('helvetica', 'bold'); pdf.setFontSize(14); pdf.text(String(page.title?? ''), margin, y); y += 8; 
        pdf.line(margin, y, pageWidth - margin, y); y += 6; 
        pdf.setFont('courier', 'normal'); pdf.setFontSize(8); 
        if (!page.data || page.data.length === 0) { pdf.text('No data available.', margin, y); continue; } 
        
        if (this.isGroupedReport(page)) { 
          const groups = page.data as ProvinceGroup[]; 
          for (const group of groups) { 
            ensureSpace(10); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11); 
            pdf.text(String(group.province?? 'Unknown Province'), margin, y); y += 6; 
            pdf.setFont('courier', 'normal'); pdf.setFontSize(8); 
            for (const item of group.items) { 
              const report = String(item.filecontent?? item.content?? '').replace(/\u0001/g, '').replace(/\u0003/g, ''); 
              const lines = pdf.splitTextToSize(report, pageWidth - (margin * 2)); 
              for (const line of lines) { ensureSpace(4); pdf.text(String(line), margin, y); y += 4; } 
              y += 3; 
            } 
          } 
        } else { 
          for (const item of page.data as any[]) { 
            let report = typeof item === 'string'? item : String(item.filecontent?? item.content?? JSON.stringify(item, null, 2)); 
            report = report.replace(/\u0001/g, '').replace(/\u0003/g, ''); 
            const lines = pdf.splitTextToSize(report, pageWidth - (margin * 2)); 
            for (const line of lines) { ensureSpace(4); pdf.text(String(line), margin, y); y += 4; } 
            y += 3; 
          } 
        } 
        continue;
      }

      if (page.type === 'image') {
        pdf.setFont('helvetica', 'bold'); pdf.setFontSize(14); pdf.text(String(page.title?? 'Image'), margin, y); y += 8; 
        pdf.line(margin, y, pageWidth - margin, y); y += 8;
        
        try {
          let imageData: string = page.imageBase64 || '';
          if (!imageData || !imageData.startsWith('data:image')) {
            pdf.setFont('helvetica', 'italic'); 
            pdf.text('Image data missing.', margin, y); 
            y += 6; 
            continue;
          }

          const props = pdf.getImageProperties(imageData);
          let imgWidth = pageWidth - (margin * 2);
          let imgHeight = (props.height * imgWidth) / props.width;

          const rotate = this.flightSections.rotateImages && 
            ((page.title?? '').toLowerCase().includes('wind') || 
             (page.title?? '').toLowerCase().includes('sigwx') || 
             (page.title?? '').toLowerCase().includes('qnh'));

          if (rotate) {
            pdf.addPage(); y = margin; drawHeader();
            imgWidth = pageHeight - 50;
            imgHeight = (props.height * imgWidth) / props.width;
            pdf.addImage(imageData, 'PNG', margin, y, imgWidth, imgHeight, undefined, 'FAST', 90);
            y += imgWidth + 10;
          } else {
            const maxHeight = pageHeight - y - 20;
            if (imgHeight > maxHeight) { 
              const ratio = maxHeight / imgHeight; 
              imgHeight = maxHeight; 
              imgWidth = imgWidth * ratio; 
            }
            ensureSpace(imgHeight + 5);
            pdf.addImage(imageData, 'PNG', margin, y, imgWidth, imgHeight, undefined, 'FAST');
            y += imgHeight + 5;
          }
        } catch (err) { 
          console.error('Image error for:', page.title, err); 
          pdf.setFont('helvetica', 'italic'); 
          pdf.text('Unable to load image.', margin, y); 
          y += 6; 
        }
        continue;
      }
    }
    drawFooter();
    await this.savePdfToDevice(pdf);
    
  } catch (error) { 
    console.error('PDF generation failed:', error); 
    alert('Unable to generate the PDF.'); 
  }
  finally { 
    this.loading = false;
    this.spinner.hide(); 
  }
}


private async savePdfToDevice(pdf: jsPDF): Promise<void> {
  try {
    const fileName = `Aviation_Weather_Report_${Date.now()}.pdf`;
    const pdfBase64 = pdf.output('datauristring').split(',')[1];
    const platform = Capacitor.getPlatform();

    // 1. WEB: normal download
    if (platform === 'web') {
      pdf.save(fileName);
      return;
    }

    // 2. ANDROID: Save to /storage/emulated/0/Download/
    // 3. IOS: Save to Documents
    const directory = platform === 'android' ? Directory.ExternalStorage : Directory.Documents;
    const path = platform === 'android' ? `Download/${fileName}` : fileName;

    const result = await Filesystem.writeFile({
      path: path,
      data: pdfBase64,
      directory: directory,
      recursive: true
    });

    console.log('PDF saved to', result.uri);

    alert(`PDF saved successfully to Downloads\n\n${fileName}`);

  } catch (error) {
    console.error('Error saving PDF to device:', error);
    alert('The PDF was generated, but could not be saved to Downloads.');
  }
}


  private parseSigmetBulletin(report: any) {
    const text = (report.filecontent || report.content || '').replace(/\u0001|\u0003/g,'').trim();
    const first = text.split('\n')[0];
    const regex = /^(FA[A-Z]{2})\s+(SIGMET|AIRMET)\s+([A-Z]\d{2})\s+VALID\s+(\d{6})\/(\d{6})/i;
    const match = first.match(regex);
    if(!match){ return null; }
    return {
      fir: match[1],
      type: match[2],
      bulletin: match[3],
      validFrom: match[4],
      validTo: match[5],
      filecontent:text,
      lastmodified:report.lastmodified
    };
  }

  private isBulletinValid(b:any){
    const now = new Date();
    const day = String(now.getUTCDate()).padStart(2,'0');
    const hh = String(now.getUTCHours()).padStart(2,'0');
    const mm = String(now.getUTCMinutes()).padStart(2,'0');
    const current = Number(day + hh + mm);
    const expiry = Number(b.validTo);
    return current <= expiry;
  }

  closeAllDropdowns() { this.isDropdownOpen2 = false; this.isDropdownOpen3 = false; this.isDropdownOpen4 = false; this.isDropdownOpen6 = false; }
  closeReport() { this.showReport = false; }
isGroupedReport(page: ReportPage): boolean {
  const t = page.title || '';
  return t.includes('METAR') || t.includes('TAF') || t.includes('SPECI');
}} 