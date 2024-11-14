/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService } from '../../../../services/location.service';
import { MessageService } from 'primeng/api';
import { Location } from '../../../../interfaces/models/location';

@Component({
  selector: 'app-location-management',
  templateUrl: './location-management.component.html',
  providers: [MessageService],
})
export class LocationManagementComponent implements OnInit {
  locations: Location[] = [];
  location!: Location;
  locationForm!: FormGroup;
  createLocationDialog: boolean = false;
  deleteLocationDialog: boolean = false;
  isEdit: boolean = false;
  loading: boolean = true;
  submitted: boolean = false;
  rows: number = 10;
  first: number = 0;
  totalRecords: number = 0;
  rowsPerPageOptions = [5, 10, 20];
  statusOptions = ['SUNNY', 'RAINFALL', 'STORM', 'SNOWY'];
  cols: any[] = [];
  selectedFiles: File[] = [];
  selectedEditLocation!: Location;
  savingState: boolean = false;

  constructor(
    private locationService: LocationService,
    private messageService: MessageService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: 'photo', header: 'Photo' },
      { field: 'name', header: 'Name' },
      { field: 'status', header: 'Status' },
      { field: 'temperature', header: 'Temperature' },
    ];
    this.initializeForm();
    this.loadLocations(1, this.rows);
  }

  initializeForm(): void {
    this.locationForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      description: ['', Validators.required],
      address: ['', Validators.required],
      status: ['', Validators.required],
      temperature: [null, Validators.required],
      photos: this.fb.array([]), // FormArray for photos
    });
  }

  loadLocations(pageNumber: number, pageSize: number): void {
    this.loading = true;
    this.locationService.getLocations(pageNumber, pageSize).subscribe({
      next: data => {
        this.locations = data.results as Location[];
        this.totalRecords = data.numberOfElements as number;
        this.loading = false;
      },
      error: error => {
        console.error('Error loading locations!', error);
      },
    });
  }

  openNew(): void {
    this.initializeForm();
    this.createLocationDialog = true;
    this.isEdit = false;
  }

  editLocation(location: Location): void {
    this.createLocationDialog = true;
    this.isEdit = true;
    this.selectedEditLocation = location;

    // Patch form with location data
    this.locationForm.patchValue({
      id: location.id,
      name: location.name,
      description: location.description,
      address: location.address,
      status: location.status,
      temperature: location.temperature,
    });

    // Populate photos
    const photosFormArray = this.locationForm.get('photos') as FormArray;
    photosFormArray.clear();
    location.photos.forEach(photo => {
      photosFormArray.push(
        this.fb.group({
          url: [photo.url, Validators.required],
          alt: [photo.alt, Validators.required],
        }),
      );
    });
  }

  get photos(): FormArray {
    return this.locationForm.get('photos') as FormArray;
  }

  addPhoto(): void {
    this.photos.push(this.fb.group({ url: '', alt: '' }));
  }

  removePhoto(index: number): void {
    this.photos.removeAt(index);
    this.selectedEditLocation.photos = this.photos.controls.map(
      control => control.value,
    );
  }

  onFileSelect(event: any): void {
    this.selectedFiles = Array.from(event.files);
  }

  saveLocation(): void {
    this.submitted = true;
    this.savingState = true;
    if (this.locationForm.invalid) {
      return;
    }

    // Create FormData and append form values
    const formData = new FormData();

    // Append the main location fields
    formData.append('name', this.locationForm.get('name')?.value);
    formData.append('description', this.locationForm.get('description')?.value);
    formData.append('address', this.locationForm.get('address')?.value);
    formData.append('status', this.locationForm.get('status')?.value);
    formData.append('temperature', this.locationForm.get('temperature')?.value);
    if (this.photos.value) {
      // Append photos array (URLs and alt text)
      const photosArray = this.photos.value;
      photosArray.forEach((photo: any, index: number) => {
        formData.append(`photos[${index}].url`, photo.url);
        formData.append(`photos[${index}].alt`, photo.alt);
      });
    }

    // Append selected files
    this.selectedFiles.forEach(file => formData.append('files', file));

    // Check if it's an edit or create operation
    if (this.isEdit) {
      formData.append('id', this.locationForm.get('id')?.value);
      this.locationService.updateLocation(formData).subscribe({
        next: data => {
          if (data.isSucceed) {
            this.loadLocations(1, this.rows);
            this.createLocationDialog = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Location updated successfully',
            });
            this.savingState = false;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: data.message,
            });
            this.savingState = false;
          }
        },
        error: err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message,
          });
          this.savingState = false;
        },
      });
    } else {
      this.locationService.createLocation(formData).subscribe({
        next: data => {
          if (data.isSucceed) {
            this.loadLocations(1, this.rows);
            this.savingState = false;
            this.createLocationDialog = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Location created successfully',
            });
          } else {
            this.savingState = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: data.message,
            });
          }
        },
        error: err => {
          this.savingState = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message,
          });
        },
      });
    }
  }

  hideDialog(): void {
    this.createLocationDialog = false;
    this.submitted = false;
    this.selectedFiles = [];
  }

  onRowsChange(newRows: number): void {
    this.rows = newRows;
    this.first = 0; // Reset to the first page
    this.loadLocations(1, this.rows);
  }

  onGlobalFilter(table: any, event: Event): void {
    this.loadLocations(1, this.rows);
  }

  clear(table: any): void {
    table.clear();
    this.loadLocations(1, this.rows);
  }

  onPageChange(event: any): void {
    this.first = event.first || 0;
    this.rows = event.rows || 10;
    this.loadLocations(this.first / this.rows + 1, this.rows);
  }

  deleteLocation(location: Location): void {
    this.location = location;
    this.deleteLocationDialog = true;
  }

  confirmDelete(): void {
    if (this.location.id) {
      this.locationService.deleteLocation(this.location.id).subscribe(() => {
        this.loadLocations(this.first / this.rows + 1, this.rows);
        this.deleteLocationDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Location Deleted',
          life: 3000,
        });
      });
    }
  }
}
