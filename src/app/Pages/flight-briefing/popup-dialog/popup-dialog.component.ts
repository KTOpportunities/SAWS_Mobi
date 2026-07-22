import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
  async generatePdf() {
  const element = document.getElementById('pdf-content');

  if (!element) {
    this.snackBar.open('PDF content not found', 'Close', {
      duration: 3000
    });
    return;
  }

  try {
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

    const fileName = this.data.flightNumber
      ? `${this.data.flightNumber}-nsWEBPIB.pdf`
      : 'nsWEBPIB-Query.pdf';

    pdf.save(fileName);

    this.snackBar.open('PDF generated successfully', 'Close', {
      duration: 3000
    });

  } catch (error) {
    console.error('Error generating PDF:', error);

    this.snackBar.open('Failed to generate PDF', 'Close', {
      duration: 3000
    });
  }
    
  }
 downloadChart(chart: any) {
  const link = document.createElement('a');

  // Path to the image in assets
  link.href = 'assets/nodata.png';

  // File name when downloaded
  link.download = chart.label.replace(/\s+/g, '_') + '.png';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
}