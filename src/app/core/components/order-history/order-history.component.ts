import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  BookingHistoryResponse,
  PaymentTransactionStatus,
} from '../../../interfaces/models/response/bookingHistoryResponse';
import { PaymentService } from '../../../services/payment.service';
import { Router } from '@angular/router';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  bookingHistories: BookingHistoryResponse[] = [];
  expandedRowKeys: { [key: string]: boolean } = {};
  rows: number = 10;
  first: number = 0;
  totalRecords: number = 0;
  globalFilter: string = '';
  isLoading: boolean = false;
  isLoaded: boolean = false;
  rowsPerPageOptions = [5, 10, 20];
  rowsPerPageDropdownOptions: { label: string; value: number }[] = [];
  private destroy$ = new Subject<void>();
  selectedTransactionStatus: PaymentTransactionStatus | null = null;
  transactionStatusOptions = [
    { label: 'Successful', value: 'SUCCESSFUL' },
    { label: 'Failed', value: 'FAILED' },
    { label: 'Pending', value: 'PENDING' },
  ];
  feedbackSubmittedIds: Set<string> = new Set();
  postedTourTripIds: string[] = [];
  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private postService: PostService,
  ) {}

  ngOnInit(): void {
    this.rowsPerPageDropdownOptions = this.rowsPerPageOptions.map(option => ({
      label: option.toString(),
      value: option,
    }));
    this.loadBookingHistories();
    this.loadUserPosts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBookingHistories(
    pageNumber: number = 1,
    pageSize: number = this.rows,
  ): void {
    this.isLoading = true;
    const statusFilter = this.selectedTransactionStatus || '';
    this.paymentService
      .getBookingHistory(pageNumber, pageSize, statusFilter, this.globalFilter)
      .subscribe({
        next: response => {
          this.bookingHistories = response.results ?? [];
          this.totalRecords = response.totalElements ?? 0;
          this.isLoading = false;
        },
        error: err => {
          console.error('Error loading booking histories:', err);
          this.isLoading = false;
        },
      });
  }
  private loadUserPosts(): void {
    this.postService.getUserPosts().subscribe({
      next: response => {
        // Extract and store `tourTripId`s from user posts
        this.postedTourTripIds =
          response.result?.map(post => post.tourTripId) || [];
      },
      error: err => {
        console.error('Error loading user posts:', err);
      },
    });
  }
  onRowExpand(event: any): void {
    this.expandedRowKeys[event.data.id] = true;
  }

  onRowCollapse(event: any): void {
    delete this.expandedRowKeys[event.data.id];
  }

  clear(table: any): void {
    this.filter.nativeElement.value = '';
    table.clear();
    if (this.globalFilter !== '') {
      this.globalFilter = '';
    }
  }

  onPageChange(event: any): void {
    if (this.first === event.first && this.rows === event.rows) {
      return; // Nếu `first` và `rows` không thay đổi, không gọi API
    }
    this.first = event.first || 0;
    this.rows = event.rows || 10;
    const pageNumber = Math.floor(this.first / this.rows) + 1;
    this.loadBookingHistories(pageNumber, this.rows);
  }

  onRowsChange(newRows: number): void {
    if (this.rows === newRows) {
      return; // Nếu `rows` không thay đổi, không gọi API
    }
    this.rows = newRows;
    this.first = 0;
    this.loadBookingHistories(1, this.rows);
  }

  onGlobalFilter(event: Event, table: any): void {
    const input = event.target as HTMLInputElement;
    const searchKeyword = input.value.trim();
    table.filterGlobal(searchKeyword, 'contains');
  }

  onStatusFilterChange(table: any): void {
    table.filter(this.selectedTransactionStatus, 'transactionStatus', 'equals');
  }
  navigateToCreatePost(tourTripId: string, title: string): void {
    this.router.navigate(['/sharing-post'], {
      queryParams: { tourTripId, title },
    });
  }
  submitFeedback(tourTripId: string): void {
    // Code to submit feedback
    this.feedbackSubmittedIds.add(tourTripId); // Track that feedback was given for this tourTripId
  }
  isFeedbackEnabled(
    endDate: Date | undefined,
    tourTripId: string | undefined,
  ): boolean {
    if (!endDate || !tourTripId) return false;
    const hasPostedFeedback = this.postedTourTripIds.includes(tourTripId);
    return new Date(endDate) < new Date() && !hasPostedFeedback;
  }
}
