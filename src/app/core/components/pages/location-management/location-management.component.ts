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
    console.log(location);
    this.createLocationDialog = true;
    this.isEdit = true;

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
      photosFormArray.push(this.fb.group({ url: photo.url, alt: photo.alt }));
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
  }

  saveLocation(): void {
    this.submitted = true;
    if (this.locationForm.invalid) {
      return;
    }

    const locationData = this.locationForm.value;
    if (this.isEdit) {
      // Perform update
      this.locationService.updateLocation(locationData).subscribe(data => {
        if (data.isSucceed) {
          this.loadLocations(1, this.rows);
          this.createLocationDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Location updated successfully',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: data.message,
          });
        }
      });
    } else {
      // Perform create
      this.locationService.createLocation(locationData).subscribe(data => {
        if (data.isSucceed) {
          this.loadLocations(1, this.rows);
          this.createLocationDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Location created successfully',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: data.message,
          });
        }
      });
    }
  }

  hideDialog(): void {
    this.createLocationDialog = false;
    this.submitted = false;
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
