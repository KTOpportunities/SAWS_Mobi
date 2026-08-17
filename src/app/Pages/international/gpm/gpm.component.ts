import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController } from '@ionic/angular';
import { ImageModalPage } from '../../image-modal/image-modal.page';

@Component({
  selector: 'app-gpm',
  templateUrl: './gpm.component.html',
  styleUrls: ['./../international.page.scss'],
})
export class GpmComponent implements OnInit {
  isLogged: boolean = false; // Indicates if the user is logged in
  frameArray: any = []; // Array to hold frame data
  ImageArray: any = []; // Array to hold images
  fileBaseUrl: SafeResourceUrl | undefined; // Safe URL for image display
  loading: boolean = false; // Loading state for image fetching
  ImageinfoArray: any = [];
  selectedOption: string = 'West'; // Default selected option for dropdown
  selectedOptionFilename: string = 'gpm_west'; // Filename prefix based on the selected option
  isDropdownOpen: boolean = false; // State for managing dropdown visibility
  folderName: string = 'gpm'; // Folder name for image fetching
  lastModifiedHours: number = 12; // Time to filter recent images

  constructor(
    private router: Router,
    private authService: AuthService,
    private APIService: APIService,
    private sanitizer: DomSanitizer,
    private moodalCtrl: ModalController
  ) {}

  ngOnInit() {
    // Initializing the component, set up any necessary state here
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  get isLoggedIn(): boolean {
    // Check if user is logged in through AuthService
    return this.authService.getIsLoggedIn();
  }

  NavigateToInternational() {
    // Navigate to the international page
    this.router.navigate(['/international']);
  }

  gpmDropdownOpen() {
    // Toggle dropdown visibility
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: string, dropdown: string, selectedOption: string) {
    // Set selected option based on the dropdown type
    this.selectedOption = selectedOption;
    this.selectedOptionFilename = option;
  }

  viewImage(imageFilename: string) {
    const filename = this.selectedOptionFilename + imageFilename;
    const foldername = this.folderName; // Assuming folderName is already defined
    // Create an object with foldername and filename
    const imageInfo = { foldername, filename };

    // Initialize the array if it's not already initialized
    if (!this.ImageinfoArray) {
      this.ImageinfoArray = [];
    }

    // Push the image information into the array
    this.ImageinfoArray.push(imageInfo);
    console.log('Image info array:', this.ImageinfoArray);

    // Call the method to handle the array (you likely want to pass the whole array, not just the push result)
    this.ImagesArray(filename, this.ImageinfoArray);
  }

  ImagesArray(item: any, type: any[]) {
    console.log('ITEM:', item, ' TYPE:', type);

    // Filter to get the image info corresponding to the selected filename
    let ImageArray = type.filter((x) => x.filename.includes(item));
    console.log('Filtered image array:', ImageArray);

    // Pass only the first matching image to ConvertImagesArray
    if (ImageArray.length > 0) {
      this.ConvertImagesArray([ImageArray[0]]);
    }
  }

  ConvertImagesArray(ImageArray: any[]) {
    // Clear the ImageArray
    this.ImageArray = [];

    console.log('IMAGE ARRAY:', ImageArray);
    this.loading = true;
    if (ImageArray.length > 0) {
      // Fetch the first image's data
      this.APIService.GetAviationFile('gpm', ImageArray[0].filename).subscribe(
        (data) => {
          console.log('IMAGE:', data);
          const imageUrl = 'data:image/png;base64,' + data.filecontent; // Adjust the MIME type accordingly

          // Set the safe URL for the image
          this.fileBaseUrl =
            this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);

          // Store the single image in the ImageArray
          this.ImageArray.push(imageUrl);

          // Present the modal with the single image
          this.ImageViewer(this.ImageArray[0]); // Pass the single image URL
          this.loading = false;
        },
        (error) => {
          console.log('Error fetching JSON data:', error);
          this.loading = false;
        }
      );
    }
  }

  async ImageViewer(img: SafeResourceUrl) {
    // Create and present a modal to view the image
    const modal = await this.moodalCtrl.create({
      component: ImageModalPage,
      componentProps: {
        imgs: img, // Pass the single image URL to the modal
      },
      cssClass: 'transparent-modal',
    });
    modal.onWillDismiss().then(() => {
      this.loading = false; // Stop loading when the modal is closed
    });
    await modal.present();
  }
}
