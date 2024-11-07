import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TransportationService } from '../../../../services/transportation.service';
import { TourService } from '../../../../services/tour.service';
import { Transportation } from '../../../../interfaces/models/transportation';
import { Tour } from '../../../../interfaces/models/tour';

@Component({
  selector: 'app-transport-management',
  templateUrl: './transport-management.component.html',
  providers: [MessageService],
})
export class TransportManagementComponent implements OnInit {
  transportations: Transportation[] = [];
  transportationForm!: FormGroup;
  transportation: Transportation = {}; // Selected transportation for editing or deletion
  loading: boolean = true;
  createTransportationDialog: boolean = false;
  deleteTransportationDialog: boolean = false;
  isEdit: boolean = false;
  rows: number = 10;
  first: number = 0;
  totalRecords: number = 0;
  rowsPerPageOptions = [5, 10, 20];
  tours: Tour[] = [];
  cols: any[] = [];
  sortBy: string = '';
  searchTerm: string = '';
  transportationTypeOptions = [
    { label: 'Car', value: 'CAR' },
    { label: 'Plane', value: 'PLANE' },
    { label: 'Coach', value: 'COACH' },
  ];

  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private transportationService: TransportationService,
    private tourService: TourService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: 'type', header: 'Type' },
      { field: 'price', header: 'Price' },
      { field: 'capacity', header: 'Capacity' },
      { field: 'tourTitle', header: 'Tour' },
    ];
    this.loadTours();
    this.initializeForm();
    this.loadTransportations();
  }

  initializeForm(): void {
    this.transportationForm = this.fb.group({
      id: [null],
      type: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      capacity: [null, [Validators.required, Validators.min(1)]],
      tourId: ['', Validators.required],
    });
  }

  loadTransportations(pageNumber: number = this.first / this.rows + 1): void {
    this.loading = true;
    this.transportationService
      .getTransportations(
        pageNumber,
        this.rows,
        this.sortBy,
        'asc',
        this.searchTerm,
      )
      .subscribe({
        next: data => {
          this.transportations = data.results as Transportation[];
          this.totalRecords = data.totalElements as number;
          this.loading = false;
        },
        error: error => {
          console.error('Error loading transportations!', error);
          this.loading = false;
        },
      });
  }

  loadTours(): void {
    this.tourService.getTours(1, 100).subscribe(response => {
      this.tours = response.results as Tour[];
    });
  }

  openNew(): void {
    this.initializeForm();
    this.createTransportationDialog = true;
    this.isEdit = false;
  }

  editTransportation(transportation: Transportation): void {
    this.transportation = transportation;
    this.transportationForm.patchValue({
      id: transportation.id,
      type: transportation.type,
      price: transportation.price,
      capacity: transportation.capacity,
      tourId: transportation.tourId,
    });

    this.createTransportationDialog = true;
    this.isEdit = true;
  }

  clear(table: any): void {
    table.clear();
    this.filter.nativeElement.value = '';
    this.searchTerm = '';
    this.loadTransportations();
  }

  onRowsChange(event: any): void {
    this.rows = event;
    this.loadTransportations();
  }

  onGlobalFilter(table: any, event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.loadTransportations();
  }

  deleteTransportation(transportation: Transportation): void {
    this.transportation = transportation;
    this.deleteTransportationDialog = true;
  }

  confirmDelete(): void {
    if (this.transportation.id) {
      this.transportationService
        .deleteTransportation(this.transportation.id)
        .subscribe(data => {
          if (data.isSucceed) {
            this.loadTransportations();
            this.deleteTransportationDialog = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Transportation deleted successfully',
            });
          } else {
            this.sendErrorToast(data.message);
          }
        });
    }
  }

  saveTransportation(): void {
    if (this.transportationForm.invalid) {
      return;
    }

    const transportationData = this.transportationForm.value;
    if (this.isEdit) {
      this.transportationService
        .updateTransportation(transportationData)
        .subscribe({
          next: data => {
            if (data.isSucceed) {
              this.createTransportationDialog = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Transportation updated successfully',
              });
              this.loadTransportations();
            } else {
              this.sendErrorToast(data.message);
            }
          },
          error: err => {
            this.sendErrorToast(err.message);
          },
        });
    } else {
      this.transportationService
        .createTransportation(transportationData)
        .subscribe({
          next: data => {
            if (data.isSucceed) {
              this.createTransportationDialog = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Transportation created successfully',
              });
              this.loadTransportations();
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

  sendErrorToast(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }

  hideDialog(): void {
    this.createTransportationDialog = false;
    this.deleteTransportationDialog = false;
    this.transportationForm.reset();
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    const pageNumber = this.first / this.rows + 1;
    this.loadTransportations(pageNumber);
  }
}
