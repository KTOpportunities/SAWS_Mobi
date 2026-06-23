import {
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';

export interface MetarReport {
  foldername: string;
  filename: string;
  lastmodified: string;
  filecontent?: string;
}

export interface ParsedMetar {
  type: string;
  yygggg: string;
  windSpeed: string;
  windDir: string;
  visibility: string;
  ww1: string;
  ns1: string;
  hs1: string;
  ns2: string;
  hs2: string;
   cb2: string;
  ns3: string;
  hs3: string;
  ww2: string;
  temp: string;
  dewpoint: string;
  pressure: string;
  recvTime: string;
  raw: string;
}

@Component({
  selector: 'app-metar-history',
  templateUrl: './metar-history.component.html',
  styleUrls: ['./metar-history.component.scss'],
})
export class MetarHistoryComponent implements OnInit {

  loading = false;

  metarReports: MetarReport[] = [];
  filteredReports: MetarReport[] = [];
  parsedReports: ParsedMetar[] = [];

  isDropdownOpen3 = false;
  isDropdownOpen11 = false;

  selectedOption3 = 'FAOR';
  selectedOption11 = 'Select Plot meteogram';
  selectedStation = 'FAOR';

  // ✅ FIXED: must match HTML table
  displayedColumns: string[] = [
    'type',
    'yygggg',
    'windSpeed',
    'windDir',
    'visibility',
    'ww1',
    'ww2',
    'ns1',
    'hs1',
    'ns2',
    'hs2',
    'temp',
    'dewpoint',
    'pressure',
    'recvTime'
  ];

  // ✅ FIX: this was missing (causing your compile error)
  groupedStations: { province: string; stations: string[] }[] = [];

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

  constructor(
    private router: Router,
    private apiService: APIService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.buildGroupedStations(); // ✅ IMPORTANT
    this.fetchMetarReports();
  }

  // ✅ FIX: builds dropdown groups (this was missing)
  buildGroupedStations() {
    const map: { [key: string]: string[] } = {};

    Object.keys(this.airportProvinceMapping).forEach(station => {
      const province = this.airportProvinceMapping[station];

      if (!map[province]) map[province] = [];
      map[province].push(station);
    });

    this.groupedStations = this.provinceOrder
      .filter(p => map[p])
      .map(p => ({
        province: p,
        stations: map[p].sort()
      }));
  }
private extractMetars(filecontent: string): string[] {
  const lines = filecontent.split(/\r?\n/);

  const metars: string[] = [];
  let current = '';

  for (let line of lines) {
    line = line.trim();

    // ignore junk numbers like 946, 947 etc
    if (/^\d+$/.test(line) || line.includes('00000')) continue;

    if (line.startsWith('METAR') || line.startsWith('SPECI')) {
      if (current) metars.push(current.trim());
      current = line;
    } else if (current) {
      current += ' ' + line;
    }
  }

  if (current) metars.push(current.trim());

  return metars;
}
  fetchMetarReports(): void {
    this.loading = true;
    this.spinner.show();

    this.apiService.getMetarReports('metar', 3000).subscribe({
      next: (data: MetarReport[]) => {

        this.metarReports = data.map(r => ({
          ...r,
          filecontent: r.filecontent ?? ''
        }));

        this.applyFilter();

        this.loading = false;
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.spinner.hide();
      },
    });
  }

applyFilter() {

  this.parsedReports = [];

  this.metarReports.forEach(report => {

    const metars = this.extractMetars(
      report.filecontent || ''
    );

    metars.forEach(metar => {

      if (
        metar.includes(`METAR ${this.selectedStation}`) ||
        metar.includes(`SPECI ${this.selectedStation}`)
      ) {

        const parsed = this.parseMetar(
          metar,
          report.lastmodified
        );

        if (parsed.type) {
          this.parsedReports.push(parsed);
        }
      }

    });

  });

  this.parsedReports.sort((a,b) =>
    b.yygggg.localeCompare(a.yygggg)
  );

}

  selectOption(option: string, dropdown: string, event?: Event) {
    if (event) event.stopPropagation();

    if (dropdown === 'dropdown3') {
      this.selectedOption3 = option;
      this.selectedStation = option;
      this.isDropdownOpen3 = false;
      this.applyFilter();
    }
  }

  selectDropdown(type: string, event?: Event) {
    if (event) event.stopPropagation();

    this.isDropdownOpen3 = type === 'dropdown3' ? !this.isDropdownOpen3 : false;
    this.isDropdownOpen11 = type === 'dropdown11' ? !this.isDropdownOpen11 : false;
  }

  navigateToObservation() {
    this.router.navigate(['/observation']);
  }

getParsed(report: MetarReport): ParsedMetar {

  const metars = this.extractMetars(report.filecontent || '');

  const stationMetar = metars.find(m =>
    m.includes(`METAR ${this.selectedStation}`) ||
    m.includes(`SPECI ${this.selectedStation}`)
  );

  return this.parseMetar(
    stationMetar || '',
    report.lastmodified
  );
}

parseMetar(
  content: string,
  recvTime: string
): ParsedMetar {

  if (!content) {
    return this.emptyMetar();
  }

  const clean = content
    .replace(/=/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const parts = clean.split(' ');

  let type = '';
  let yygggg = '';

  let windSpeed = '';
  let windDir = '';

  let visibility = '';

  let ww1 = '';
  let ww2 = '';

  let ns1 = '';
  let hs1 = '';

  let ns2 = '';
  let hs2 = '';

  let ns3 = '';
  let hs3 = '';

  let cb2 = '';

  let temp = '';
  let dewpoint = '';

  let pressure = '';

  type = parts[0];

  yygggg = (parts[2] || '').replace('Z', '');

  let cloudIndex = 0;

  for (const p of parts) {

    if (/^(VRB\d{2}KT)$/.test(p)) {

      windDir = 'VRB';
      windSpeed = parseInt(
        p.substring(3,5),
        10
      ).toString();
    }

    else if (/^\d{5}KT$/.test(p)) {

      windDir = p.substring(0,3);

      windSpeed = parseInt(
        p.substring(3,5),
        10
      ).toString();
    }

    else if (/^\d{4}$/.test(p)) {

      visibility = p;
    }

    else if (p === 'CAVOK') {

      visibility = '10000';
    }

    else if (
      ['BR','FG','HZ','BCFG','RA','DZ','TSRA'].includes(p)
    ) {

      if (!ww1)
        ww1 = p;
      else
        ww2 = p;
    }

    else if (
      /^(FEW|SCT|BKN|OVC)\d{3}/.test(p)
    ) {

      const ns = p.substring(0,3);

      const feet =
        (
          parseInt(
            p.substring(3,6),
            10
          ) * 100
        ).toString();

      if (cloudIndex === 0) {

        ns1 = ns;
        hs1 = feet;
      }

      else if (cloudIndex === 1) {

        ns2 = ns;
        hs2 = feet;
      }

      else if (cloudIndex === 2) {

        ns3 = ns;
        hs3 = feet;
      }

      cloudIndex++;
    }

    else if (
      /^M?\d{2}\/M?\d{2}$/.test(p)
    ) {

      const vals = p.split('/');

      temp = vals[0].replace('M','-');

      dewpoint = vals[1].replace('M','-');
    }

    else if (
      /^Q\d{4}$/.test(p)
    ) {

      pressure = p.replace('Q','');
    }
  }

  return {
    type,
    yygggg,
    windSpeed,
    windDir,
    visibility,
    ww1,
    ww2,
    ns1,
    hs1,
    ns2,
    hs2,
    cb2,
    ns3,
    hs3,
    temp,
    dewpoint,
    pressure,
    recvTime: this.formatDate(recvTime),
    raw: clean
  };
}
formatDate(dateStr: string): string {

  if (!dateStr) return '';

  const d = new Date(dateStr);

  const yyyy = d.getFullYear();

  const mm = String(
    d.getMonth() + 1
  ).padStart(2,'0');

  const dd = String(
    d.getDate()
  ).padStart(2,'0');

  const hh = String(
    d.getHours()
  ).padStart(2,'0');

  const mi = String(
    d.getMinutes()
  ).padStart(2,'0');

  return `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
}
  emptyMetar(): ParsedMetar {
    return {
      type: '', yygggg: '', windSpeed: '', windDir: '', visibility: '',
      ww1: '', ww2: '', ns1: '', hs1: '', ns2: '', hs2: '', cb2: '',
      ns3: '', hs3: '', temp: '', dewpoint: '', pressure: '', recvTime: '', raw: ''
    };
  }

  
}