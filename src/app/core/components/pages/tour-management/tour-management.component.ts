import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TourService } from '../../../../services/tour.service';
import { LocationService } from '../../../../services/location.service';
import { MoodService } from '../../../../services/mood.service';
import { Mood } from '../../../../interfaces/models/mood';
import { Location } from '../../../../interfaces/models/location';
import { Tour } from '../../../../interfaces/models/tour';

@Component({
  selector: 'app-tour-management',
  templateUrl: './tour-management.component.html',
  providers: [MessageService],
})
export class TourManagementComponent implements OnInit {
  tours: any[] = [];
  tourForm!: FormGroup;
  tour: any = {}; // Selected tour for editing or deletion
  loading: boolean = true;
  createTourDialog: boolean = false;
  deleteTourDialog: boolean = false;
  isEdit: boolean = false;
  rows: number = 10;
  first: number = 0;
  totalRecords: number = 0;
  rowsPerPageOptions = [5, 10, 20];
  statusOptions = ['ACTIVE', 'INACTIVE', 'CANCELLED'];
  moodOptions: any[] = [];
  locationOptions: any[] = [];
  defaultTime = new Date();
  cols: any[] = [];
  sortByStatus: string = '';
  searchTerm: string = '';

  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private tourService: TourService,
    private messageService: MessageService,
    private moodService: MoodService,
    private locationService: LocationService,
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: 'code', header: 'Code' },
      { field: 'title', header: 'Title' },
      { field: 'startDate', header: 'Start Date' },
      { field: 'endDate', header: 'End Date' },
      { field: 'totalPrice', header: 'Total Price' },
      { field: 'status', header: 'Status' },
    ];
    this.loadMoods();
    this.loadLocations();
    this.initializeForm();
    this.loadTours();
  }

  initializeForm(): void {
    this.tourForm = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      totalPrice: [null, [Validators.required, Validators.min(0)]],
      status: ['', Validators.required],
      tourMoods: [[], Validators.required],
      locationInTours: [[], Validators.required],
    });
  }

  get tourMoods(): FormArray {
    return this.tourForm.get('tourMoods') as FormArray;
  }

  get locationInTours(): FormArray {
    return this.tourForm.get('locationInTours') as FormArray;
  }

  loadTours(pageNumber: number = this.first / this.rows + 1): void {
    this.loading = true;
    this.tourService
      .getTours(pageNumber, this.rows, this.sortByStatus, this.searchTerm)
      .subscribe({
        next: data => {
          this.tours = data.results as Tour[];
          this.totalRecords = data.totalElements as number;
          this.loading = false;
        },
        error: error => {
          console.error('Error loading tours!', error);
          this.loading = false;
        },
      });
  }

  onSortByStatusChange(status: string): void {
    this.sortByStatus = status;
    this.loadTours(); // Reload tours with the updated sort status
  }

  loadMoods(): void {
    this.moodService.getMoods(1, 100).subscribe(response => {
      this.moodOptions = response.results as Mood[];
    });
  }

  loadLocations(): void {
    this.locationService.getLocations(1, 100).subscribe(response => {
      this.locationOptions = response.results as Location[];
    });
  }

  openNew(): void {
    this.initializeForm();
    this.createTourDialog = true;
    this.isEdit = false;
  }

  editTour(tour: any): void {
    this.tour = tour; // Save the current tour to edit or delete
    this.tourForm.patchValue({
      id: tour.id,
      title: tour.title,
      description: tour.description,
      startDate: new Date(tour.startDate),
      endDate: new Date(tour.endDate),
      totalPrice: tour.totalPrice,
      status: tour.status,
      tourMoods: tour.tourMoods || [],
      locationInTours: tour.locationInTours || [],
    });

    this.createTourDialog = true;
    this.isEdit = true;
  }

  populateFormArray(formArray: FormArray, values: any[]): void {
    formArray.clear();
    values.forEach(value => formArray.push(this.fb.control(value)));
  }

  clear(table: any): void {
    table.clear();
    this.filter.nativeElement.value = '';
    this.searchTerm = '';
    this.sortByStatus = '';
    this.loadTours();
  }

  onRowsChange(event: any): void {
    this.rows = event;
    this.loadTours();
  }

  onGlobalFilter(table: any, event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.loadTours(); // Reload tours with the updated search term
  }

  deleteTour(tour: any): void {
    this.tour = tour; // Set the selected tour to delete
    this.deleteTourDialog = true;
  }

  confirmDelete(): void {
    if (this.tour.id) {
      this.tourService.deleteTour(this.tour.id).subscribe(data => {
        if (data.isSucceed) {
          this.loadTours();
          this.deleteTourDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Tour deleted successfully',
          });
        } else {
          this.sendErrorToast(data.message);
        }
      });
    }
  }

  saveTour(): void {
    if (this.tourForm.invalid) {
      return;
    }

    const tourData = this.tourForm.value;
    if (this.isEdit) {
      this.tourService.updateTour(tourData).subscribe(data => {
        if (data.isSucceed) {
          this.loadTours();
          this.createTourDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Tour updated successfully',
          });
        } else {
          this.sendErrorToast(data.message);
        }
      });
    } else {
      this.tourService.createTour(tourData).subscribe(data => {
        if (data.isSucceed) {
          this.loadTours();
          this.createTourDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Tour created successfully',
          });
        } else {
          this.sendErrorToast(data.message);
        }
      });
    }
  }

  sendErrorToast(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }

  hideDialog(): void {
    this.createTourDialog = false;
    this.deleteTourDialog = false;
    this.tourForm.reset();
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    const pageNumber = this.first / this.rows + 1;
    this.loadTours(pageNumber); // Pass the calculated page number
  }
}
