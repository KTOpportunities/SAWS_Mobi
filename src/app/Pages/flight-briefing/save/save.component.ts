import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { PopupDialogComponent } from '../popup-dialog/popup-dialog.component';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./../flight-briefing.page.scss'],
})
export class SaveComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['Flight','departure', 'destination','etd','vfr','edit'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isLogged: boolean = false;
  loading: boolean = false;
  currentUser: any = {};

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: APIService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    if (!this.authService.getIsLoggedIn()) {
      this.router.navigate(['/login']);
    }
    this.currentUser = JSON.parse(sessionStorage.getItem('CurrentUser') || '{}');
    this.loadFlights();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  NavigateToFlightBriefing() {
    this.router.navigate(['/flight-briefing']);
  }

  addNewFlight() {
    this.router.navigate(['/flight-briefing/edit']);
  }

  loadFlights() {
    this.loading = true;
    this.apiService.getFlightTemplates().subscribe({
      next: (res: any[]) => {
        const mapped = (res || []).map(f => ({
          Flight: f.flightNumber,
          departure: `${f.departureICAO}/${this.getAirportName(f.departureICAO)}`, // FAOR/JNB/JOHANNESBURG
          destination: `${f.destinationICAO}/${this.getAirportName(f.destinationICAO)}`,
          etd: f.etd,
          vfr: 'IFR',
          raw: f
        }));
        this.dataSource.data = mapped;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert('Failed to load flights');
      }
    });
  }

  deleteAllFlights() {
    if(!confirm('Delete all flights? This cannot be undone.')) return;
    this.loading = true;
    const deletes = this.dataSource.data.map(row =>
      this.apiService.deleteFlightTemplate(row.raw.flightTemplateId).toPromise()
    );

    Promise.all(deletes).then(() => {
      alert('All flights deleted');
      this.loadFlights();
    }).catch(err => {
      console.error(err);
      alert('Failed to delete all');
      this.loading = false;
    });
  }

 editFlight(row: any) {
  // pass flightNumber so edit page can find it in the dropdown list
  this.router.navigate(['/flight-briefing/flight-edit'], { 
    queryParams: { flight: row.raw.flightNumber } 
  });
}

  generateFlight(row: any) {
    this.dialog.open(PopupDialogComponent, {
      width: '99%',
      data: {
        type: 'document',
        flightNumber: row.raw.flightNumber,
        departureAirport: row.raw.departureICAO,
        destinationAirport: row.raw.destinationICAO,
        enroute: row.raw.enRouteICAO,
        etd: row.etd,
        ete: row.raw.ete
      }
    });
  }

  // FIXED: Now returns "IATA/CITY" instead of full name
  getAirportName(icao: string): string {
    const airportData: { [key: string]: { iata: string, city: string } } = {
      // Gauteng
      'FAOR': { iata: 'JNB', city: 'JOHANNESBURG' },
      'FALA': { iata: 'HLA', city: 'LANSERIA' },
      'FAJB': { iata: '', city: 'JOHANNESBURG' },
      'FAIR': { iata: '', city: 'WATERKLOOF' },
      'FAWB': { iata: 'WKF', city: 'WATERKLOOF' },
      'FAWK': { iata: 'PRY', city: 'PRETORIA' },
      'FAGC': { iata: 'GCJ', city: 'MIDRAND' },
      'FAGM': { iata: 'QRA', city: 'GERMISTON' },
      'FASI': { iata: '', city: 'SPRINGS' },
      'FAVV': { iata: 'VIR', city: 'VEREENIGING' },

      // Limpopo
      'FAPP': { iata: 'PTG', city: 'POLOKWANE' },
      'FALM': { iata: 'LMG', city: 'MOKOPANE' },
      'FAHS': { iata: 'HDS', city: 'HOEDSPRUIT' },
      'FATH': { iata: 'THY', city: 'THOHOYANDOU' },
      'FATV': { iata: 'TZN', city: 'TZANEEN' },
      'FAER': { iata: 'ELL', city: 'ELLISRAS' },
      'FATZ': { iata: '', city: 'THABAZIMBI' },
      'FATI': { iata: '', city: 'TSHIPISE' },
      'FAVM': { iata: '', city: 'VIVO' },

      // Mpumalanga
      'FAKN': { iata: 'MQP', city: 'NELSPRUIT' },
      'FANS': { iata: 'NLP', city: 'NELSPRUIT' },
      'FAEO': { iata: '', city: 'EMOYENI' },
      'FASR': { iata: 'SZK', city: 'SKUKUZA' },
      'FAWI': { iata: '', city: 'WHITE RIVER' },
      'FAKP': { iata: '', city: 'KOMATIPOORT' },
      'FASZ': { iata: 'SZK', city: 'SKUKUZA' },

      // Northwest Province
      'FAMM': { iata: 'MBD', city: 'MAFIKENG' },
      'FALI': { iata: 'LTA', city: 'LICHTENBURG' },
      'FAKD': { iata: 'KLER', city: 'KLERKSDORP' },
      'FARG': { iata: 'RST', city: 'RUSTENBURG' },
      'FAPN': { iata: 'POT', city: 'POTCHEFSTROOM' },
      'FAPS': { iata: 'SRE', city: 'SCHWEIZER RENEKE' },
      'FAMK': { iata: 'MMB', city: 'MMABATHO' },

      // Western Cape
      'FACT': { iata: 'CPT', city: 'CAPE TOWN' },
      'FAGG': { iata: 'GRJ', city: 'GEORGE' },
      'FALW': { iata: 'LZN', city: 'LANGEBAANWEG' },
      'FAOB': { iata: 'OUD', city: 'OUDTSHOORN' },
      'FABY': { iata: 'BFT', city: 'BEAUFORT WEST' },
      'FAPG': { iata: 'PBZ', city: 'PLETTENBERG BAY' },
      'FAYP': { iata: 'YPL', city: 'YSTERPLAAT' },
      'FAOH': { iata: 'OVG', city: 'OVERBERG' },

      // Eastern Cape
      'FAPE': { iata: 'PLZ', city: 'PORT ELIZABETH' },
      'FAEL': { iata: 'ELS', city: 'EAST LONDON' },
      'FAUT': { iata: 'UTT', city: 'UMTATA' },
      'FABE': { iata: 'BIY', city: 'BHISHO' },

      // KwaZulu-Natal
      'FALE': { iata: 'DUR', city: 'DURBAN' },
      'FAPM': { iata: 'PZB', city: 'PIETERMARITZBURG' },
      'FARB': { iata: 'RCB', city: 'RICHARDS BAY' },
      'FAMG': { iata: 'MGH', city: 'MARGATE' },
      'FAVG': { iata: 'VIR', city: 'DURBAN' },
      'FAGY': { iata: '', city: 'GREYTOWN' },
      'FAUL': { iata: 'ULD', city: 'ULUNDI' },
      'FALY': { iata: 'LAD', city: 'LADYSMITH' },
      'FANC': { iata: 'NCS', city: 'NEWCASTLE' },
      'FAMX': { iata: '', city: 'MKUZE' },

      // Freestate
      'FABL': { iata: 'BFN', city: 'BLOEMFONTEIN' },
      'FABM': { iata: 'BTH', city: 'BETHLEHEM' },
      'FAWM': { iata: 'WEL', city: 'WELKOM' },
      'FAHV': { iata: 'HRS', city: 'HARRISMITH' },
      'FAKS': { iata: 'KST', city: 'KROONSTAD' },
      'FAFB': { iata: '', city: 'BOTHAVILLE' },

      // Northern Cape
      'FAUP': { iata: 'UTN', city: 'UPINGTON' },
      'FAKM': { iata: 'KIM', city: 'KIMBERLEY' },
      'FADY': { iata: 'DAE', city: 'DE AAR' },
      'FACV': { iata: 'CAL', city: 'CALVINIA' },
      'FASB': { iata: 'SIS', city: 'SISHEN' },
      'FAAB': { iata: 'ABY', city: 'ALEXANDER BAY' },
      'FASS': { iata: 'SUT', city: 'SUTHERLAND' },

      // Lesotho
      'FXMM': { iata: 'MSU', city: 'MASERU' },

      // Eswatini
      'FDMS': { iata: 'SHO', city: 'MANZINI' },
      'FDSK': { iata: 'MTS', city: 'MATSAPHA' },

      // Botswana
      'FBSK': { iata: 'GBE', city: 'GABORONE' },
      'FBMN': { iata: 'MUB', city: 'MAUN' },
      'FBFT': { iata: 'FRW', city: 'FRANCISTOWN' },
      'FBGZ': { iata: 'BBK', city: 'KASANE' },
      'FBJW': { iata: 'JWA', city: 'JWANENG' },
      'FBKE': { iata: 'PKW', city: 'KEETMANSHOOP' },
      'FBMP': { iata: 'MPZ', city: 'MOPI' },
      'FBPA': { iata: 'PAL', city: 'PALAPYE' },
      'FBTE': { iata: 'TSD', city: 'TSABONG' },
      'FBTS': { iata: '', city: 'TSWAPONG' },
      'FBSN': { iata: 'SRX', city: 'SEROWE' },
      'FBSP': { iata: 'SXN', city: 'SOWA' },
      'FBSW': { iata: 'SPU', city: 'SELEBI PHIKWE' },
      'FBLT': { iata: 'LET', city: 'LETLHAKANE' },

      // Namibia
      'FYWH': { iata: 'WDH', city: 'WINDHOEK' },
      'FYWE': { iata: 'ERS', city: 'WINDHOEK' },
      'FYKM': { iata: 'MPA', city: 'KATIMA MULILO' },
      'FYKT': { iata: 'KMP', city: 'KEETMANSHOOP' },
      'FYWB': { iata: 'WVB', city: 'WALVIS BAY' },
      'FYGF': { iata: 'GFN', city: 'GROOTFONTEIN' },
      'FYLZ': { iata: 'LUD', city: 'LUDERITZ' },
      'FYOA': { iata: 'OND', city: 'ONDANGWA' },
      'FYOG': { iata: 'OMD', city: 'ORANJEMUND' },
      'FYRU': { iata: 'NDU', city: 'RUNDU' },

      // Mozambique
      'FQMA': { iata: 'MPM', city: 'MAPUTO' },
      'FQBR': { iata: 'BEW', city: 'BEIRA' },
      'FQNP': { iata: 'APL', city: 'NACALA' },
      'FQIN': { iata: 'APL', city: 'NAMPULA' },
      'FQLC': { iata: 'VXC', city: 'LICHINGA' },
      'FQPB': { iata: 'POL', city: 'PEMBA' },
      'FQQL': { iata: 'UEL', city: 'QUELIMANE' },
      'FQTE': { iata: 'TET', city: 'TETE' },
      'FQTT': { iata: 'TET', city: 'TETE' },
      'FQVL': { iata: 'VNX', city: 'VILANKULO' },

      // Zimbabwe
      'FVRG': { iata: 'HRE', city: 'HARARE' },
      'FVJN': { iata: 'BUQ', city: 'BULAWAYO' },
      'FVKB': { iata: 'KAB', city: 'KARIBA' },
      'FVFA': { iata: 'VFA', city: 'VICTORIA FALLS' },
      'FVCZ': { iata: 'MVZ', city: 'MASVINGO' },
      'FVTL': { iata: 'UTA', city: 'MUTARE' },
      'FVWN': { iata: 'HWK', city: 'HWANGE' },

      // Other Regions
      'FWKI': { iata: 'KIS', city: 'KISUMU' },
      'FWCL': { iata: 'CFK', city: 'CHLEF' },
      'FLKK': { iata: 'NIQ', city: 'KIKWIT' },
      'FLSK': { iata: 'SSI', city: 'SASSANDRA' },
      'FNLU': { iata: 'LAD', city: 'LUANDA' },
      'FLHN': { iata: 'HIR', city: 'HONIARA' },
      'FLND': { iata: 'NDJ', city: 'NDJAMENA' },

      // Other Stations
      'FAME': { iata: '', city: 'MALAMALA' },
    };

    const data = airportData[icao]; // <-- THIS WAS THE BUG. Added [icao]
    if (data) {
      return `${data.iata}/${data.city}`;
    }
    return `//`; // fallback if not found
  }

  
}