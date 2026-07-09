import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-popup-dialog',
  templateUrl: './popup-dialog.component.html',
  styleUrls: ['./popup-dialog.component.scss'],
})
export class PopupDialogComponent implements OnInit {
  takeoffData: string = '';
errorMessage = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private apiService: APIService,
    private dialog: MatDialog,
     private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
      this.data.selectAll ??= false;
  this.data.sun ??= false;
  this.data.mon ??= false;
  this.data.tue ??= false;
  this.data.wed ??= false;
  this.data.thu ??= false;
  this.data.fri ??= false;
  this.data.sat ??= false;
    this.loadOperationalSettings();
    if (this.data.type === 'document') {
      this.setNames();
      this.loadTakeoffData();
    }
  }

  setNames() {
    const names = this.data.airportNames || {};
    this.data.depName = names[this.data.departureAirport] || '';
    this.data.destName = names[this.data.destinationAirport] || '';
    this.data.enrouteName = names[this.data.enroute] || '';
    this.data.alternateName = names[this.data.alternateICAO] || '';
  }

  saveOperationalSettings() {
  const body = {
    pilotName: this.data.pilotName,
    pilotLicense: this.data.pilotLicense,
    dispatcherName: this.data.dispatcherName,
    dispatcherLicense: this.data.dispatcherLicense
  };

  this.apiService.saveOperationalSettings(body).subscribe({
    next: (response: any) => {

      this.snackBar.open(
        'Operational settings saved successfully.',
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        }
      );

    },
    error: (err) => {

      this.snackBar.open(
        'Failed to save operational settings.',
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        }
      );

      console.error(err);
    }
  });
}

  loadOperationalSettings() {
    this.apiService.getOperationalSettings().subscribe({
      next: (response: any) => {
        if (!response) return;
        this.data.pilotName = response.pilotName;
        this.data.pilotLicense = response.pilotLicense;
        this.data.dispatcherName = response.dispatcherName;
        this.data.dispatcherLicense = response.dispatcherLicense;
      },
      error: err => console.error(err)
    });
  }

  loadTakeoffData() {
  if (!this.data.departureAirport) return;

  this.apiService.GetSourceTextFolderFiles('varmet').subscribe({
    next: (files: any[]) => {

      const departure = this.data.departureAirport;

      // Find only the TAKE-OFF file for the departure airport
      const takeoffFile = files.find(file => {

        if (!file.filecontent || !file.filecontent.includes('TAKE-OFF DATA')) {
          return false;
        }

        // Extract ICAO from the file
        const match = file.filecontent.match(/\b[A-Z]{4}\b/);
        const airportCode = match ? match[0] : '';

        return airportCode === departure;

      });

      if (!takeoffFile) {
        this.takeoffData = 'No Take-Off data available.';
        return;
      }

      const start = takeoffFile.filecontent.indexOf('TAKE-OFF DATA');

      this.takeoffData =
        start >= 0
          ? takeoffFile.filecontent.substring(start).trim()
          : 'No Take-Off data available.';
    },

    error: err => console.error(err)
  });
}
    printPage() {
    window.print();
    }
  
 saveSchedule() {

  this.errorMessage = '';

  // Replace this with your real validation
  const hasOutputsAssigned = false;

  if (!hasOutputsAssigned) {
    this.errorMessage =
      '❌ You do not have any outputs assigned to you. Contact your system administrator for more help.';
    return;
  }

  // Save schedule here...
 }
  toggleAllDays() {

  this.data.sun = this.data.selectAll;
  this.data.mon = this.data.selectAll;
  this.data.tue = this.data.selectAll;
  this.data.wed = this.data.selectAll;
  this.data.thu = this.data.selectAll;
  this.data.fri = this.data.selectAll;
  this.data.sat = this.data.selectAll;

  }
  
  outputDestinations = [
  {
    id: 1,
    name: 'Email'
  },
  {
    id: 2,
    name: 'Printer'
  },
  {
    id: 3,
    name: 'Shared Folder'
  }
];

manageOutputDestinations(): void {
  console.log('Manage Output Destinations');
  // Open your destination dialog here
}

generateAndSend(): void {
  console.log('Generate and Send', this.data.outputDestination);
  // Call your API here
}
}