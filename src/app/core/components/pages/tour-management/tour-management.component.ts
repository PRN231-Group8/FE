import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TourService } from '../../../../services/tour.service';
import { LocationService } from '../../../../services/location.service';
import { MoodService } from '../../../../services/mood.service';
import { Mood } from '../../../../interfaces/models/mood';
import { Location } from '../../../../interfaces/models/location';
import { Tour } from '../../../../interfaces/models/tour';
import { TourTimestamp } from '../../../../interfaces/models/tour-timestamp';
import { TourTimestampService } from '../../../../services/tour-timestamp.service';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { Guid } from 'guid-typescript';
import { TourTripService } from '../../../../services/tour-trip.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tour-management',
  templateUrl: './tour-management.component.html',
  providers: [MessageService, DatePipe],
  styles: [
    `
      :host ::ng-deep .p-rowgroup-footer td {
        font-weight: 700;
      }

      :host ::ng-deep .p-rowgroup-header {
        span {
          font-weight: 700;
        }

        .p-row-toggler {
          vertical-align: middle;
          margin-right: 0.25rem;
        }
      }
    `,
  ],
})
export class TourManagementComponent implements OnInit {
  // Components value
  expandedRowKeys: { [key: string]: boolean } = {};
  rows: number = 10;
  first: number = 0;
  loading: boolean = true;
  cols: any[] = [];
  totalRecords: number = 0;
  rowsPerPageOptions = [5, 10, 20];
  searchTerm: string = '';
  isEdit: boolean = false;
  savingState: boolean = false;

  // Tour variables management
  tours: Tour[] = [];
  tourForm!: FormGroup;
  tour: Tour | null = null;
  statusOptions = ['ACTIVE', 'INACTIVE', 'CANCELLED'];
  durationMinutes: number = 1;
  sortByStatus: string = '';
  locationOptions: Location[] = [];
  moodOptions: Mood[] = [];
  tourToDelete!: Tour;
  createTourDialog: boolean = false;
  deleteTourDialog: boolean = false;

  // Timestamp variables management
  timestampForm!: FormGroup;
  newTimestamps: TourTimestamp[] = []; // for storing new timestamp added
  selectedTimestamp: TourTimestamp | null = null;
  isCreatingBatch: boolean = false;
  isTimestampEdit: boolean = false;
  timestampToDelete: TourTimestamp | null = null;
  timestampDialog: boolean = false;
  deleteTimestampDialog: boolean = false;

  // Tour Trip management
  tourTrips: any[] = [];
  tourTripForm!: FormGroup;
  newTourTrips: any[] = []; // for storing new Tour Trips added
  isTourTripEdit: boolean = false;
  tourTripDialog: boolean = false;
  tourTripToDelete: any | null = null;
  deleteTourTripDialog: boolean = false;
  tourTripStatusOptions = ['OPEN', 'FULLYBOOKED', 'COMPLETED', 'CANCELLED'];
  minDate: Date | undefined;
  maxDate: Date | undefined;
  isCreateTourTripBatch: boolean = false;

  // Others
  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private tourService: TourService,
    private messageService: MessageService,
    private moodService: MoodService,
    private timestampService: TourTimestampService,
    private locationService: LocationService,
    private tourTripService: TourTripService,
  ) {}

  ngOnInit(): void {
    this.initializeColumns();
    this.initializeForm();
    this.loadTours();
    this.loadMoods();
    this.loadLocations();
  }

  initializeColumns(): void {
    this.cols = [
      { field: 'code', header: 'Code' },
      { field: 'title', header: 'Title' },
      { field: 'startDate', header: 'Start Date' },
      { field: 'endDate', header: 'End Date' },
      { field: 'totalPrice', header: 'Total Price' },
      { field: 'status', header: 'Status' },
    ];
  }

  initializeForm(): void {
    this.tourForm = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      status: ['', Validators.required],
      tourMoods: [[], Validators.required],
      locationInTours: [[], Validators.required],
    });

    this.timestampForm = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      description: ['', Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      locationId: [null, Validators.required],
      tourId: [null],
      location: [null],
    });

    // Initialize the tour trip form
    this.tourTripForm = this.fb.group({
      tourTripId: [null],
      tripDate: [null, Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      totalSeats: [0, [Validators.required, Validators.min(1)]],
      bookedSeats: [0],
      tripStatus: ['', Validators.required],
      tourId: [null],
    });
  }

  loadTours(pageNumber: number = this.first / this.rows + 1): void {
    this.loading = true;
    this.tourService
      .getTours(pageNumber, this.rows, this.sortByStatus, this.searchTerm)
      .subscribe({
        next: data => {
          this.tours = data.results as Tour[];
          this.totalRecords = data.totalElements || 0;
          this.loading = false;
        },
        error: error => {
          console.error('Error loading tours!', error);
          this.loading = false;
        },
      });
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
    this.tourForm.reset();
    this.createTourDialog = true;
    this.isEdit = false;
  }

  editTour(tour: any): void {
    this.tour = tour;
    const selectedMoods = this.moodOptions.filter(mood =>
      tour.tourMoods?.some((m: any) => m.id === mood.id),
    );
    const selectedLocations = this.locationOptions.filter(location =>
      tour.locationInTours?.some((loc: any) => loc.id === location.id),
    );

    const startDate = new Date(tour.startDate);
    const endDate = new Date(tour.endDate);

    this.tourForm.patchValue({
      id: tour.id,
      title: tour.title,
      description: tour.description,
      startDate: startDate,
      endDate: endDate,
      status: tour.status,
      tourMoods: selectedMoods,
      locationInTours: selectedLocations,
    });

    this.createTourDialog = true;
    this.isEdit = true;
  }

  saveTour(): void {
    this.savingState = true;
    if (this.tourForm.invalid) {
      return;
    }

    const tourData = {
      ...this.tourForm.value,
      tourMoods: this.tourForm.value.tourMoods.map((mood: Mood) => mood.id),
      locationInTours: this.tourForm.value.locationInTours.map(
        (location: Location) => location.id,
      ),
    };
    const saveObservable = this.isEdit
      ? this.tourService.updateTour(tourData)
      : this.tourService.createTour(tourData);

    saveObservable.subscribe({
      next: data => {
        if (data.isSucceed) {
          this.loadTours();
          this.createTourDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this.isEdit
              ? 'Tour updated successfully'
              : 'Tour created successfully',
          });
        } else {
          this.sendErrorToast(data.message);
        }
      },
      error: err => {
        this.sendErrorToast(err.message);
      },
    });

    this.savingState = false;
  }

  deleteTour(tour: Tour): void {
    this.tour = tour;
    this.deleteTourDialog = true;
  }

  confirmDelete(): void {
    if (!this.tour?.id) return;
    this.savingState = true;

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
    this.savingState = false;
  }

  sendErrorToast(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }

  viewTimestamps(tour: Tour): void {
    const tourId = tour.id!.toString();

    if (!tour.tourTimestamps) {
      this.timestampService.getTourTimestampById(Guid.parse(tourId)).subscribe({
        next: data => {
          tour.tourTimestamps = [...(data.results || [])] as TourTimestamp[];
          this.tour = tour;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error loading timestamps!',
          });
        },
      });
    }
  }

  addTimestamp(tour: Tour): void {
    this.timestampForm.reset();
    this.tour = tour;
    this.timestampForm.patchValue({
      tourId: tour.id,
    });
    this.isTimestampEdit = false;
    this.timestampDialog = true;
  }

  editTimestamp(tour: Tour, timestamp: TourTimestamp): void {
    this.tour = tour;
    this.selectedTimestamp = timestamp;

    const [startHours, startMinutes, startSeconds] =
      timestamp.preferredTimeSlot.startTime.split(':');
    const startTime = new Date();
    startTime.setHours(+startHours, +startMinutes, +startSeconds);

    const [endHours, endMinutes, endSeconds] =
      timestamp.preferredTimeSlot.endTime.split(':');
    const endTime = new Date();
    endTime.setHours(+endHours, +endMinutes, +endSeconds);
    this.isTimestampEdit = true;
    this.timestampForm.patchValue({
      id: timestamp.id,
      title: timestamp.title,
      description: timestamp.description,
      startTime: startTime,
      endTime: endTime,
      locationId: timestamp.location?.id,
      tourId: timestamp.tourId,
      location: timestamp.location,
    });
    this.timestampDialog = true;
  }

  saveTimestamp(): void {
    if (this.timestampForm.invalid || !this.tour) return;
    this.savingState = true;

    const formValues = this.timestampForm.value;

    // Convert startTime and endTime Date objects to "HH:mm:ss" string format
    const formatTime = (time: Date): string => {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      const seconds = time.getSeconds().toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    };

    // Set location object along with locationId
    const selectedLocation = this.locationOptions.find(
      loc => loc.id === formValues.locationId,
    );

    const newTimestamp: TourTimestamp = {
      ...formValues,
      preferredTimeSlot: {
        startTime: formatTime(formValues.startTime),
        endTime: formatTime(formValues.endTime),
      },
      location: selectedLocation,
    };

    if (this.isTimestampEdit && this.selectedTimestamp) {
      // Call the update API if editing an existing timestamp
      this.timestampService
        .updateTourTimestamp(this.selectedTimestamp.id!, newTimestamp)
        .subscribe({
          next: data => {
            if (data.isSucceed) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Timestamp updated successfully',
              });
              if (this.tour && this.tour.tourTimestamps) {
                const index = this.tour.tourTimestamps.findIndex(
                  timestamp => timestamp?.id === this.selectedTimestamp?.id,
                );

                if (index !== -1 && index !== undefined) {
                  this.tour.tourTimestamps[index] = newTimestamp;
                }
              }
              this.timestampDialog = false;
              this.savingState = false;
            } else {
              this.sendErrorToast(data.message);
              this.savingState = false;
            }
          },
          error: error => {
            this.sendErrorToast(error.message);
            this.savingState = false;
          },
        });
      return;
    }

    // Add new timestamp to the array for batch saving
    this.newTimestamps.push(newTimestamp);
    this.isCreatingBatch = true;

    console.log(this.newTimestamps);

    // Update the local tour's timestamps for immediate display
    this.tour!.tourTimestamps = [
      ...(this.tour!.tourTimestamps || []),
      newTimestamp,
    ];

    this.timestampDialog = false;
    this.savingState = false;
  }

  hideDialog(): void {
    this.createTourDialog = false;
    this.deleteTourDialog = false;
    this.timestampDialog = false;
    this.tourForm.reset();
  }

  saveAllTimestamps(): void {
    if (this.newTimestamps.length > 0) {
      this.timestampService
        .createBatchTourTimestamps(this.newTimestamps, this.durationMinutes)
        .subscribe({
          next: data => {
            if (data.isSucceed) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'All timestamps saved successfully',
              });
              this.savingState = false;
              // Clear the newTimestamps array after successful save
              this.newTimestamps = [];
              this.viewTimestamps(this.tour!); // Refresh the timestamps for the current tour
            } else {
              this.sendErrorToast(data.message);
            }
          },
          error: error => {
            this.sendErrorToast(error.message);
          },
        });
    }
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    const pageNumber = this.first / this.rows + 1;
    this.loadTours(pageNumber);
  }

  clear(table: any): void {
    table.clear();
    this.filter.nativeElement.value = '';
    this.searchTerm = '';
    this.sortByStatus = '';
    this.loadTours();
  }

  onSortByStatusChange(status: string): void {
    this.sortByStatus = status;
    this.loadTours();
  }

  onGlobalFilter(table: any, event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.loadTours();
  }

  onRowsChange(event: any): void {
    this.rows = event;
    this.loadTours();
  }

  onRowExpand(event: TableRowExpandEvent): void {
    const tour = event.data;
    this.expandedRowKeys[tour.id] = true; // Set the specific row key to true

    // Load Tour Trips and Timestamps if not already loaded
    if (!tour.tourTrips) {
      this.tourTripService.getTourTripsByTourId(tour.id).subscribe(response => {
        tour.tourTrips = response.result || [];
      });
    }

    if (!tour.tourTimestamps) {
      this.timestampService
        .getTourTimestampById(tour.id)
        .subscribe(response => {
          tour.tourTimestamps = response.results || [];
        });
    }
  }

  onRowCollapse(event: TableRowCollapseEvent): void {
    const tour = event.data;
    delete this.expandedRowKeys[tour.id]; // Remove the specific row key when collapsed
  }

  confirmDeleteTimestamp(tour: Tour, timestamp: TourTimestamp): void {
    this.timestampToDelete = timestamp;
    this.tourToDelete = tour;
    this.deleteTimestampDialog = true;
  }

  deleteTimestamp(): void {
    if (!this.timestampToDelete?.id) return;

    this.timestampService
      .deleteTourTimestamp(this.timestampToDelete.id)
      .subscribe(data => {
        if (data.isSucceed) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Timestamp deleted successfully',
          });
          this.ngOnInit();
          this.deleteTimestampDialog = false;
          this.timestampToDelete = null;
          this.savingState = false;
        } else {
          this.deleteTimestampDialog = false;
          this.timestampToDelete = null;
          this.savingState = false;
          this.sendErrorToast(data.message);
        }
      });
  }

  cancelDeleteTimestamp(): void {
    this.deleteTimestampDialog = false;
    this.timestampToDelete = null;
  }

  clearLastTimestamps(): void {
    this.newTimestamps.pop();
    this.tour?.tourTimestamps?.pop();
    // update after remove last timestamp
    this.tour!.tourTimestamps = [
      ...(this.tour!.tourTimestamps || []).filter(
        t => !this.newTimestamps.includes(t),
      ),
      ...this.newTimestamps,
    ];
  }

  // Open dialog to add a new Tour Trip
  addTourTrip(tour: any): void {
    this.tourTripForm.reset();
    this.tour = tour;
    this.minDate = new Date(this.tour!.startDate!);
    this.maxDate = new Date(this.tour!.endDate!);
    this.tourTripForm.patchValue({
      tourId: tour.id,
    });
    this.isTourTripEdit = false;
    this.tourTripDialog = true;
  }

  // Open dialog to edit an existing Tour Trip
  editTourTrip(tour: Tour, trip: any): void {
    this.tour = tour;
    this.isTourTripEdit = true;

    // Convert ISO date string to Date object
    const tripDate = new Date(trip.tripDate);

    this.tourTripForm.patchValue({
      tourTripId: trip.tourTripId,
      tripDate: tripDate,
      price: trip.price,
      totalSeats: trip.totalSeats,
      bookedSeats: trip.bookedSeats,
      tripStatus: trip.tripStatus,
      tourId: tour.id,
    });
    this.tourTripDialog = true;
  }

  // Save or update a Tour Trip
  saveTourTrip(): void {
    if (this.tourTripForm.invalid) return;
    this.savingState = true;

    const formValues = this.tourTripForm.value;
    const newTourTrip = {
      ...formValues,
    };

    if (this.isTourTripEdit) {
      // Call the API to update the existing tour trip
      this.tourTripService
        .updateTourTrip(newTourTrip.tourTripId, newTourTrip)
        .subscribe({
          next: data => {
            if (data.isSucceed) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Tour trip updated successfully',
              });
              this.savingState = false;

              // Update the trip in the local tour's trips array
              const index = this.tour?.tourTrips?.findIndex(
                trip => trip.tourTripId === newTourTrip.tourTripId,
              );
              if (index !== undefined && index !== -1) {
                this.tour?.tourTrips?.splice(index, 1, newTourTrip);
              }
              this.tourTripDialog = false;
            } else {
              this.sendErrorToast(data.message);
              this.savingState = false;
            }
          },
          error: err => {
            this.sendErrorToast(err.message);
            this.savingState = false;
            return;
          },
        });
    } else {
      // If adding a new trip, push to newTourTrips array for batch saving
      this.newTourTrips.push(newTourTrip);
      this.isCreateTourTripBatch = true;
      this.tour!.tourTrips = [...(this.tour!.tourTrips || []), newTourTrip];
    }

    this.tourTripDialog = false;
    this.savingState = false;
  }

  // Save all new Tour Trips in batch
  saveAllTourTrips(): void {
    if (this.newTourTrips.length > 0) {
      this.tourTripService.createBatchTourTrips(this.newTourTrips).subscribe({
        next: data => {
          if (data.isSucceed) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'All tour trips saved successfully',
            });
            this.newTourTrips = [];
            this.loadTours(); // Refresh tours
            this.isCreateTourTripBatch = false;
            this.savingState = false;
          } else {
            this.sendErrorToast(data.message);
            this.savingState = false;
          }
        },
        error: error => {
          this.sendErrorToast(error.message);
          this.savingState = false;
        },
      });
    }
  }

  // Confirm deletion of a Tour Trip
  confirmDeleteTourTrip(tour: Tour, trip: any): void {
    this.tourTripToDelete = trip;
    this.tour = tour;
    this.savingState = true;
    this.deleteTourTripDialog = true;
  }

  // Delete a Tour Trip
  deleteTourTrip(): void {
    if (!this.tourTripToDelete?.tourTripId) return;

    this.tourTripService
      .deleteTourTrip(this.tourTripToDelete.tourTripId)
      .subscribe({
        next: data => {
          if (data.isSucceed) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Tour trip deleted successfully',
            });
            this.savingState = false;
            this.loadTours();
            this.deleteTourTripDialog = false;
          } else {
            this.savingState = false;
            this.sendErrorToast(data.message);
          }
        },
        error: error => {
          this.savingState = false;
          this.sendErrorToast(error.message);
        },
      });
  }

  // Clear the last added tour trip from newTourTrips
  clearLastTourTrips(): void {
    this.newTourTrips.pop();
    this.tour?.tourTrips?.pop();
  }

  hideTourTripDialog(): void {
    this.tourTripDialog = false;
    this.savingState = false;
  }

  cancelDeleteTourTrip(): void {
    this.tourTripToDelete = {};
    this.deleteTourTripDialog = false;
    this.savingState = false;
  }
}
