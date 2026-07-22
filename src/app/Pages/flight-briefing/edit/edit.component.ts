

import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, DoCheck } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Keyboard } from '@capacitor/keyboard';
import { Platform } from '@ionic/angular';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { PopupDialogComponent } from '../popup-dialog/popup-dialog.component';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./../flight-briefing.page.scss'],
})
export class EditComponent implements OnInit, DoCheck {

  isLogged: boolean = false;
  loading: boolean = false;
  isDropdownOpen1: boolean = false;
  isDropdownOpen2: boolean = false;
  selectedOption1: string = 'Select flight';
  selectedOption2: string = 'Select template';
  isKeyboardVisible = false;
  private mobileQuery: MediaQueryList;
  isMobile: boolean;

  departureMetar = '';
  departureTaf = '';
  destinationMetar = '';
  destinationTaf = '';
  alternateMetar = '';
  alternateTaf = '';

  // Flight information
  flightName: string = '';
  departureAirport: string = '';
  destinationAirport: string = '';
  enroute: string = '';
  alternateICAO: string = '';
  etd: string = '';
  ete: string = '';
  date: string = new Date().toISOString();

  isVfr: boolean = false;
  includeCrossSection: boolean = false;
  includeTakeoff: boolean = false;
  includeAispib: boolean = false;
  spaceWeather: boolean = false;
  cyclone: boolean = false;
  volash: boolean = false;

  // Weather cache
  flightWeather: string[] = [];
  templates: any[] = [];
  selectedTemplate: any = null;
  private mobileQueryListener: () => void;

  // Locks
  lockedCrossSection: boolean = false;
  lockedTakeoff: boolean = false;
  lockedAispib: boolean = false;
  lockedSpaceWeather: boolean = false;
  lockedCyclone: boolean = false;
  lockedVolash: boolean = false;

  // PERSISTED SETTINGS OBJECT
  settings: any = {
    corridorWidth: 'narrow',
    customNM: '',
    otherAerodromes: '',
    firs: '',
    weatherLevels: {
      defaultLow: true, fl050: false, fl140: false, fl240: false, fl320: false, fl390: false, fl480: false,
      defaultMed: false, defaultHigh: false,
      fl100: false, fl210: false, fl300: false, fl360: false, fl450: false
    },
    charts: {
      route: false, eur: false, sio: false, eurafi: false, afrasia: false, eursam: false, nat: false
    },
    windTemp: {
      route: false, sio: false, west: false, namafr: false, africa: false, eurafi: false, east: false
    },
    localCharts: {
      blockLow: false, blockHigh: false, ukAsh: false, high: false, low: false
    }
  }

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
  onCheckboxChange(field: string, value: boolean) {
    switch(field) {
      case 'crossSection': this.includeCrossSection = value; if(value) this.lockedCrossSection = true; break;
      case 'takeoff': this.includeTakeoff = value; if(value) this.lockedTakeoff = true; break;
      case 'aispib': this.includeAispib = value; if(value) this.lockedAispib = true; break;
      case 'space': this.spaceWeather = value; if(value) this.lockedSpaceWeather = true; break;
      case 'cyclone': this.cyclone = value; if(value) this.lockedCyclone = true; break;
      case 'volash': this.volash = value; if(value) this.lockedVolash = true; break;
    }
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: APIService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private mediaMatcher: MediaMatcher,
    private platform: Platform,
     private route: ActivatedRoute,
  ) {
    this.mobileQuery = this.mediaMatcher.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => (this.isMobile = this.mobileQuery.matches);
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
    this.isMobile = this.mobileQuery.matches;
    Keyboard.addListener('keyboardWillShow', () => { this.isKeyboardVisible = true; });
    Keyboard.addListener('keyboardWillHide', () => { this.isKeyboardVisible = false; });
  }

  ngOnInit() {
    if (!this.authService.getIsLoggedIn()) {
      this.router.navigate(['/login']);
    }
    this.platform.ready().then(() => {
      Keyboard.addListener('keyboardWillShow', () => { this.isKeyboardVisible = true; });
      Keyboard.addListener('keyboardWillHide', () => { this.isKeyboardVisible = false; });
    });
    this.loadSettings(); // LOAD SAVED SETTINGS
    this.loadWeather();
    this.loadTemplates();

     this.route.queryParams.subscribe(params => {
      if (params['flight']) {
        const flightNumber = params['flight'];
        // wait 300ms for loadTemplates() to finish
        setTimeout(() => {
          const template = this.templates.find(t => t.flightNumber === flightNumber);
          if(template) {
            this.selectTemplate(template);
          }
        }, 300);
      }
    });
  }

  ngDoCheck() {
    this.saveSettings(); // AUTO SAVE ON ANY CHANGE
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
    Keyboard.removeAllListeners();
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  NavigateToFlightBriefing() {
    this.router.navigate(['/flight-briefing']);
  }

  // PERSISTENCE FUNCTIONS
  saveSettings() {
    const userId = JSON.parse(sessionStorage.getItem('CurrentUser') || '{}').aspUserId || 'guest';
    localStorage.setItem(`flightSettings_${userId}`, JSON.stringify(this.settings));
  }

  loadSettings() {
    const userId = JSON.parse(sessionStorage.getItem('CurrentUser') || '{}').aspUserId || 'guest';
    const saved = localStorage.getItem(`flightSettings_${userId}`);
    if (saved) {
      this.settings = {...this.settings,...JSON.parse(saved) };
    }
  }

  clearAll(section: string) {
    if (section === 'weatherLevels') Object.keys(this.settings.weatherLevels).forEach(k => this.settings.weatherLevels[k] = false);
    if (section === 'charts') Object.keys(this.settings.charts).forEach(k => this.settings.charts[k] = false);
    if (section === 'windTemp') Object.keys(this.settings.windTemp).forEach(k => this.settings.windTemp[k] = false);
    if (section === 'localCharts') Object.keys(this.settings.localCharts).forEach(k => this.settings.localCharts[k] = false);
    this.saveSettings();
  }

  clearAllSettings() {
    if(!confirm('Clear all selections?')) return;
    this.settings = {
      corridorWidth: 'narrow', customNM: '', otherAerodromes: '', firs: '',
      weatherLevels: { defaultLow: true, fl050: false, fl140: false, fl240: false, fl320: false, fl390: false, fl480: false, defaultMed: false, defaultHigh: false, fl100: false, fl210: false, fl300: false, fl360: false, fl450: false },
      charts: { route: false, eur: false, sio: false, eurafi: false, afrasia: false, eursam: false, nat: false },
      windTemp: { route: false, sio: false, west: false, namafr: false, africa: false, eurafi: false, east: false },
      localCharts: { blockLow: false, blockHigh: false, ukAsh: false, high: false, low: false }
    };
    this.saveSettings();
    this.presentToast('All selections cleared');
  }

  calculateDefaults() {
    this.settings.weatherLevels.defaultLow = true;
    this.settings.charts.route = true;
    this.settings.corridorWidth = 'narrow';
    this.saveSettings();
    this.presentToast('Default values applied');
  }

  selectTemplate(template: any) {
    this.selectedTemplate = template;
    this.selectedOption2 = `${template.flightNumber}`;
    this.isDropdownOpen2 = false;
    this.flightName = template.flightNumber;
    this.departureAirport = template.departureICAO;
    this.destinationAirport = template.destinationICAO;
    this.enroute = template.enRouteICAO;
    this.alternateICAO = template.enRouteICAO;
    this.etd = template.etd;
    this.ete = template.ete;
    if(this.flightWeather.length === 0){
      this.loadWeather(() => this.setWeatherFromTemplate(template));
    } else {
      this.setWeatherFromTemplate(template);
    }
  }

  setWeatherFromTemplate(template: any) {
    const dep = this.getWeather(template.departureICAO);
    this.departureMetar = dep.metar; this.departureTaf = dep.taf;
    const dest = this.getWeather(template.destinationICAO);
    this.destinationMetar = dest.metar; this.destinationTaf = dest.taf;
    const alt = this.getWeather(template.enRouteICAO);
    this.alternateMetar = alt.metar; this.alternateTaf = alt.taf;
  }

  selectDropdown(dropdown: string) {
    if (dropdown === 'dropdown1') this.isDropdownOpen1 =!this.isDropdownOpen1;
    if (dropdown === 'dropdown2') this.isDropdownOpen2 =!this.isDropdownOpen2;
  }

  closeAllDropdowns() {
    this.isDropdownOpen1 = false;
    this.isDropdownOpen2 = false;
  }

  popupData: any = {
    scheduling: { title: 'Scheduling Options for ' + this.flightName, content: '<p>Content for scheduling goes here...</p>' },
    folder: { title: 'Folder Format Settings', content: '<p>Folder format configuration content...</p>' },
    document: { title: 'Generate Document', content: '<p>Document generation content...</p>' },
    operation: { title: 'Operation Information', content: '<p>Operation details go here...</p>' },
    output: { title: 'Generate Output', content: '<p>Output generation content...</p>' }
  };

  openPopup(key: string) {
    const requiredKeys = ['document', 'scheduling', 'output', 'folder', 'operation'];
    if (requiredKeys.includes(key)) {
      if (!this.flightName ||!this.departureAirport ||!this.destinationAirport) {
        this.presentToast('Please select a template or fill flight details first');
        return;
      }
    }
    if (key === 'document' && this.flightWeather.length === 0) {

      this.presentToast('Weather is still loading. Please wait...');
      return;
    }
    const data: any = { type: key,...this.popupData[key] };
    if (key === 'document') {
      data.flightNumber = this.flightName;
      data.departureAirport = this.departureAirport;
      data.destinationAirport = this.destinationAirport;
      data.enroute = this.enroute;
      data.alternateICAO = this.alternateICAO;
      data.etd = this.etd;
      data.ete = this.ete;
      data.date = this.date;
      data.departureMetar = this.departureMetar;
      data.departureTaf = this.departureTaf;
      data.destinationMetar = this.destinationMetar;
      data.destinationTaf = this.destinationTaf;
      data.alternateMetar = this.alternateMetar;
      data.alternateTaf = this.alternateTaf;
      data.flightWeather = this.flightWeather;
      data.airportNames = this.airportNames;
      data.routeCharts = this.getSelectedRouteCharts();
    }
    this.dialog.open(PopupDialogComponent, { width: '99vw', data });
  }

  loadWeather(callback?: () => void) {
    console.log('🔄 Starting loadWeather...');
    this.apiService.GetSourceTextFolderFilesTime('metar', 24).subscribe({
      next: (metarFiles) => {
        this.apiService.GetSourceTextFolderFilesTime('taffc', 24).subscribe({
          next: (tafFiles) => {
            const reports: string[] = [];
            metarFiles.forEach((f: any) => { const matches = f.filecontent?.match(/METAR\s+[A-Z]{4}[\s\S]*?=/g); if (matches) reports.push(...matches); });
            tafFiles.forEach((f: any) => { const matches = f.filecontent?.match(/TAF\s+[A-Z]{4}[\s\S]*?=/g); if (matches) reports.push(...matches); });
            this.flightWeather = reports;
            console.log('🚀 Total reports loaded:', this.flightWeather.length);
            if(callback) callback();
          }
        });
      },
      error: (err) => console.error('❌ Failed to load weather:', err)
    });
  }

  getWeather(icao: string) {
    if(!icao) return {metar: 'No METAR', taf: 'No TAF'};
    const metar = this.flightWeather.find(x => x.startsWith(`METAR ${icao}`));
    const taf = this.flightWeather.find(x => x.startsWith(`TAF ${icao}`));
    return { metar: metar || 'No METAR', taf: taf || 'No TAF' };
  }

  loadTemplates() {
    this.loading = true;
    this.apiService.getFlightTemplates().subscribe({
      next: (res) => { this.templates = res || []; this.loading = false; },
      error: (err) => { console.error('❌ Failed to load templates', err); this.loading = false; }
    });
  }

  addNewTemplate() {
    if (this.selectedTemplate) { this.presentToast('Clear selection first'); return; }
    if (!this.flightName ||!this.departureAirport ||!this.destinationAirport) { this.presentToast('Please fill flight details first'); return; }
    const user = JSON.parse(sessionStorage.getItem('CurrentUser') || '{}');
    const body = {
      flightNumber: this.flightName,
      templateName: `${this.departureAirport} - ${this.destinationAirport}`,
      departureICAO: this.departureAirport,
      destinationICAO: this.destinationAirport,
      enRouteICAO: this.enroute,
      etd: this.etd,
      ete: this.ete,
      createdby_aspnetuserId: user.aspUserId
    };
    this.loading = true;
    this.apiService.createFlightTemplate(body).subscribe({
      next: () => { this.presentToast('Template saved!'); this.loadTemplates(); this.loading = false; },
      error: (err) => { console.error(err); this.presentToast('Failed to save template'); this.loading = false; }
    });
  }

  deleteTemplate(template: any) {
    if(!confirm(`Delete template ${template.flightNumber}?`)) return;
    this.loading = true;
    this.apiService.deleteFlightTemplate(template.flightTemplateId).subscribe({
      next: () => {
        this.presentToast('Template deleted');
        if(this.selectedTemplate?.flightTemplateId === template.flightTemplateId) this.clearSelection();
        this.loadTemplates(); this.loading = false;
      },
      error: (err) => { console.error('Failed to delete', err); this.presentToast('Failed to delete'); this.loading = false; }
    });
  }

  deleteSelectedTemplate() { if(this.selectedTemplate) this.deleteTemplate(this.selectedTemplate); }

  clearSelection() {
    this.selectedTemplate = null;
    this.selectedOption2 = 'Select template';
    this.flightName = ''; this.departureAirport = ''; this.destinationAirport = '';
    this.enroute = ''; this.etd = ''; this.ete = '';
  }
async downloadPdf() {
  const element = document.getElementById('pdf-content');

  if (!element) {
    this.presentToast('PDF content not found');
    return;
  }

  try {
    this.loading = true;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      scrollX: 0,
      scrollY: -window.scrollY
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = 210;
    const pageHeight = 297;

    const imgWidth = pdfWidth;
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

    const fileName = this.flightName
      ? `${this.flightName}-nsWEBPIB.pdf`
      : 'nsWEBPIB-Query.pdf';

    pdf.save(fileName);

    this.presentToast('PDF generated successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    this.presentToast('Failed to generate PDF');
  } finally {
    this.loading = false;
  }
  }
  getSelectedRouteCharts(): { label: string; url: string }[] {
  const charts: { label: string; url: string }[] = [];

  // BUFR Significant Weather chart
  charts.push({
    label: 'BUFR (Significant Weather) M0830+12 (FL250-FL630)',
    url: 'https://your-api-or-file-link/bufr-significant-weather.pdf'
  });

  // GRIB Wind/Temp charts by selected flight level
  const levels = [
    'FL050', 'FL080', 'FL100', 'FL140', 'FL180', 'FL210',
    'FL240', 'FL270', 'FL300', 'FL320', 'FL340', 'FL360',
    'FL390', 'FL410', 'FL450', 'FL480', 'FL530'
  ];

  levels.forEach(level => {
    const key = level.toLowerCase(); // e.g. FL050 -> fl050

    if (this.settings.weatherLevels[key]) {
      charts.push({
        label: `GRIB (Wind/Temp) M0830+12 (${level})`,
        url: `https://your-api-or-file-link/grib-${level.toLowerCase()}.pdf`
      });
    }
  });

  // Cross-section chart
  if (this.includeCrossSection) {
    charts.push({
      label: 'Wind/Temp cross-section for M0830+12',
      url: 'https://your-api-or-file-link/wind-temp-cross-section.pdf'
    });
  }

  return charts;
}
  presentToast(message: string) { alert(message); }
}