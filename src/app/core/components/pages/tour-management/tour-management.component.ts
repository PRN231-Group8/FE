import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Tour } from '../../../../interfaces/models/tour';
import { TourService } from '../../../../services/tour.service';
import { format } from 'date-fns';
import { catchError, throwError } from 'rxjs';
import { BaseResponse } from '../../../../interfaces/models/base-response';

interface ExpandedRows {
  [key: string]: boolean;
}

interface PageEvent {
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;
}

@Component({
  selector: 'app-tour-management',
  templateUrl: './tour-management.component.html',
  providers: [MessageService],
})
export class TourManagementComponent implements OnInit {
  isCreating: boolean = false;
  isEdit: boolean = false;
  tourDialog: boolean = false;
  createTourDialog: boolean = false;
  deleteTourDialog: boolean = false;
  submitted: boolean = false;
  loading: boolean = true;
  tours: Tour[] = [];
  tour: Tour = {};
  expandedRows: ExpandedRows = {};
  cols: any[] = [];
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  totalPages: number = 0;
  rowsPerPageOptions = [5, 10, 20];
  searchTerm?: string;
  statusOptions = ['ACTIVE', 'INACTIVE', 'CANCELLED'];
  defaultTime!: Date;
  selectedStatus: string | undefined;
  dateRange: Date[] = [];
  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private tourService: TourService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.defaultTime = new Date();
    this.defaultTime.setHours(6, 0, 0);
    this.loadTours(1, this.rows, this.searchTerm);
    this.cols = [
      { field: 'id', header: 'Tour ID' },
      { field: 'title', header: 'Title' },
      { field: 'startDate', header: 'Start Date' },
      { field: 'endDate', header: 'End Date' },
      { field: 'totalPrice', header: 'Total Price' },
      { field: 'status', header: 'Status' },
    ];
  }

  private loadTours(
    pageNumber: number,
    pageSize: number,
    searchTerm?: string,
  ): void {
    this.loading = true;
    this.tourService.getTours(pageNumber, pageSize, searchTerm).subscribe({
      next: data => {
        this.tours = data.results as Tour[];
        this.loading = false;
        this.totalRecords = data.totalRecords;
        this.totalPages = data.totalPages;
      },
      error: error => {
        console.error('There was an error!', error);
      },
    });
  }

  openNew(): void {
    this.tour = {};
    this.submitted = false;
    this.createTourDialog = true;
    this.selectedStatus = undefined;
    this.isCreating = true;
    this.isEdit = false;
  }

  editTour(tour: Tour): void {
    this.tour = { ...tour };
    this.isCreating = false;
    this.isEdit = true;
    this.createTourDialog = true;
    this.selectedStatus = tour.status;
  }

  hideDialog(): void {
    this.tourDialog = false;
    this.submitted = false;
    this.createTourDialog = false;
  }

  deleteTour(tour: Tour): void {
    this.deleteTourDialog = true;
    this.tour = { ...tour };
  }

  confirmDelete(): void {
    this.deleteTourDialog = false;
    if (this.tour.id !== undefined) {
      this.tourService
        .deleteTour(this.tour.id)
        .subscribe((data: BaseResponse<Tour>) => {
          if (data.isSucceed) {
            this.tours = this.tours.filter(val => val.id !== this.tour.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Tour Deleted',
              life: 3000,
            });
            this.loadTours(
              this.first / this.rows + 1,
              this.rows,
              this.searchTerm,
            );
          } else {
            this.handleError(data);
          }
        });
    } else {
      console.error('Tour ID is undefined');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Tour ID is undefined.',
        life: 3000,
      });
    }
  }

  saveTour(): void {
    this.tour.status = this.selectedStatus;
    this.submitted = true;
    if (this.isCreating || this.isEdit) {
      const formattedStartDate = format(
        this.tour.startDate as Date,
        "yyyy-MM-dd'T'HH:mm",
      );
      const formattedEndDate = format(
        this.tour.endDate as Date,
        "yyyy-MM-dd'T'HH:mm",
      );

      const tourPayload = {
        ...this.tour,
        startDate: new Date(formattedStartDate),
        endDate: new Date(formattedEndDate),
      };

      if (this.tour.id !== undefined) {
        this.tourService
          .updateTour(tourPayload)
          .pipe(
            catchError(error => {
              this.handleError(error);
              return throwError(() => error);
            }),
          )
          .subscribe({
            next: data => {
              if (data.isSucceed) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: data.message,
                  life: 3000,
                });
                this.loadTours(
                  this.first / this.rows + 1,
                  this.rows,
                  this.searchTerm,
                );
                this.isEdit = false;
                this.createTourDialog = false;
                this.tourDialog = false;
              }
            },
          });
      } else {
        this.tourService
          .createTour(tourPayload)
          .pipe(
            catchError(error => {
              this.handleError(error);
              return throwError(() => error);
            }),
          )
          .subscribe({
            next: data => {
              if (data.isSucceed) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: data.message,
                  life: 3000,
                });
                this.loadTours(
                  this.first / this.rows + 1,
                  this.rows,
                  this.searchTerm,
                );
                this.isEdit = false;
                this.createTourDialog = false;
                this.tourDialog = false;
              }
            }
          });
      }
    }
  }

  onGlobalFilter(dt1: any, event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.loadTours(1, this.rows, this.searchTerm);
  }

  clear(table: Table): void {
    table.clear();
    this.filter.nativeElement.value = '';
    this.searchTerm = undefined;
    this.loadTours(1, this.rows, this.searchTerm);
  }

  onPageChange(event: PageEvent): void {
    this.first = event.first || 0;
    this.rows = event.rows || 10;
    const pageNumber = this.first / this.rows + 1;
    this.loadTours(pageNumber, this.rows, this.searchTerm);
  }

  onRowsChange(newRows: number): void {
    this.first = 0;
    this.rows = newRows;
    this.loadTours(1, this.rows, this.searchTerm);
  }

  isFormValid(): boolean {
    return (
      !!this.tour.title &&
      !!this.tour.description &&
      !!this.tour.startDate &&
      !!this.tour.endDate &&
      this.tour.totalPrice !== undefined &&
      !!this.selectedStatus
    );
  }

  // Helper function to handle errors
  private handleError(error: any): void {
    if (error.results) {
      error.results.forEach((err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: `Error on ${err.propertyName}`,
          detail: err.errorMessage,
          life: 3000,
        });
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred while processing the request.',
        life: 3000,
      });
    }
  }
}
