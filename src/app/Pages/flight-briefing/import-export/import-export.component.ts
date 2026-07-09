import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-import-export',
  templateUrl: './import-export.component.html',
  styleUrls: ['./../flight-briefing.page.scss'],
})
export class ImportExportComponent implements OnInit {

  isLogged: boolean = false;
  loading: boolean = false;
  isDropdownOpen1: boolean = false;
  isDropdownOpen2: boolean = false;
  selectedOption1: string = 'Select flight';
  selectedOption2: string = 'Select template';

  flights: any[] = [];
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

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  NavigateToFlightBriefing() {
    this.router.navigate(['/flight-briefing']);
  }

  selectOption(option: string, dropdown: string) {
    if (dropdown === 'dropdown1') {
      this.selectedOption1 = option;
      this.isDropdownOpen1 = false;
    }
    if (dropdown === 'dropdown2') {
      this.selectedOption2 = option;
      this.isDropdownOpen2 = false;
    }
  }

  selectDropdown(dropdown: string) {
    if (dropdown === 'dropdown1') this.isDropdownOpen1 =!this.isDropdownOpen1;
    if (dropdown === 'dropdown2') this.isDropdownOpen2 =!this.isDropdownOpen2;
  }

  closeAllDropdowns() {
    this.isDropdownOpen1 = false;
    this.isDropdownOpen2 = false;
  }

  loadFlights() {
    this.loading = true;
    this.apiService.getFlightTemplates().subscribe({
      next: (res) => {
        this.flights = res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert('Failed to load flights');
      }
    });
  }

  exportFlight() {
    if(this.selectedOption1 === 'Select flight') {
      alert('Please select a flight first');
      return;
    }

    const flight = this.flights.find(f => f.flightNumber === this.selectedOption1);
    if(!flight) {
      alert('Flight not found');
      return;
    }

    const xml = this.buildFBXML(flight);
    this.downloadFile(xml, `${flight.flightNumber}.fb`);
  }

  buildFBXML(flight: any): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<fb>
  <version>00.12</version>
  <name>${flight.flightNumber}</name>
  <user>${this.currentUser.username || 'unknown'}</user>
  <route>
    <departure><record type="icao"><icao metauto="1" sa="0" fc="0" ft="0">${flight.departureICAO}</icao></record></departure>
    <destination><record type="icao"><icao metauto="1" sa="0" fc="0" ft="0">${flight.destinationICAO}</icao></record></destination>
    <enroute><record type="icao"><icao metauto="1" sa="0" fc="0" ft="0">${flight.enRouteICAO}</icao></record></enroute>
    <additional><icao metauto="1" sa="0" fc="0" ft="0">${flight.enRouteICAO}</icao></additional>
    <fir>
      <record metauto="1" sig="0" air="0" gamet="0" ars="0">${this.getFIR(flight.departureICAO)}</record>
      <record metauto="1" sig="0" air="0" gamet="0" ars="0">${this.getFIR(flight.destinationICAO)}</record>
    </fir>
    <wmo/><flevels/>
    <swc><record>SIO(AREA-K)</record></swc>
    <wc><record>AFRICA</record></wc>
    <localcharts/>
    <ete>${flight.ete || '0000'}</ete>
    <etd>${flight.etd || '0000'}</etd>
    <etdoffset/>
    <corridor>narrow</corridor>
    <vfr>false</vfr>
    <dataset/>
    <crosssection>true</crosssection>
    <volash>Y</volash>
    <takeoff>Y</takeoff>
    <cyclone>Y</cyclone>
    <spaceweather>Y</spaceweather>
    <aispib>N</aispib>
  </route>
  <format>
    <type>pdf</type>
    <theme>SAWS</theme>
    <coverpage>true</coverpage>
    <dataformat>
      <metarformat>info</metarformat>
      <metargrouping>stationtype</metargrouping>
      <sigmetformat>info</sigmetformat>
      <sigmetgrouping>firtype</sigmetgrouping>
      <pilotname></pilotname><pilotlicense></pilotlicense>
      <dispatchername></dispatchername><dispatchlicense></dispatchlicense>
      <username>${this.currentUser.username}</username>
    </dataformat>
    <decode_taf>false</decode_taf>
    <decode_metar>false</decode_metar>
  </format>
</fb>`;
  }

  downloadFile(data: string, filename: string) {
    const blob = new Blob([data], { type: 'text/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    alert(`Exported ${filename}`);
  }

  getFIR(icao: string): string {
    const map: any = {
      'FAOR':'FAJA', 'FALA':'FAJA', 'FAWB':'FAJA', 'FAGM':'FAJA',
      'FQMA':'FQBE', 'FARB':'FQBE', 'FALE':'FQBE'
    };
    return map[icao] || 'FAJA';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const xmlString = e.target?.result as string;
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlString, "text/xml");

        const importedFlight = {
          flightNumber: xml.querySelector('name')?.textContent || `IMP-${Date.now()}`,
          departureICAO: xml.querySelector('departure icao')?.textContent || '',
          destinationICAO: xml.querySelector('destination icao')?.textContent || '',
          enRouteICAO: xml.querySelector('enroute icao')?.textContent || '',
          etd: xml.querySelector('etd')?.textContent || '',
          ete: xml.querySelector('ete')?.textContent || '',
        };

        if(!importedFlight.departureICAO ||!importedFlight.destinationICAO) {
          return alert('Invalid.fb file');
        }

        this.saveImportedFlight(importedFlight);
      } catch(err) {
        alert('Failed to parse file');
      }
    };
    reader.readAsText(file);
  }

  saveImportedFlight(flight: any) {
    const body = {
    ...flight,
      templateName: `${flight.departureICAO} - ${flight.destinationICAO}`,
      createdby_aspnetuserId: this.currentUser.aspUserId
    };
    this.loading = true;
    this.apiService.createFlightTemplate(body).subscribe({
      next: () => {
        alert('Flight imported successfully!');
        this.loadFlights();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        alert('Failed to import flight');
        this.loading = false;
      }
    });
  }
}