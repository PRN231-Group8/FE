import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarOptions } from 'fullcalendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { PhotoService } from '../../../../services/photo.service';
import { TourTripService } from '../../../../services/tour-trip.service';
import { BaseResponse } from '../../../../interfaces/models/base-response';
import { TourTripResponse } from '../../../../interfaces/models/response/tour-trip-response';
import { DecimalPipe } from '@angular/common';
import { TourTrip } from '../../../../interfaces/models/tour-trip';
import { TourService } from '../../../../services/tour.service';
import { Guid } from 'guid-typescript';
import { PaymentService } from '../../../../services/payment.service';
import { Tour } from '../../../../interfaces/models/tour';
import { Transportation } from '../../../../interfaces/models/transportation';
import { Mood } from '../../../../interfaces/models/mood';
import { Location } from '../../../../interfaces/models/location';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { VnpayFormComponent } from '../vnpay-form/vnpay-form.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-tour-detail',
  templateUrl: './tour-detail.component.html',
  providers: [DecimalPipe, DialogService, MessageService],
})
export class TourDetailComponent implements OnInit {
  images: any[] | undefined;
  responsiveOptions: any[] | undefined;
  calendarOptions: CalendarOptions;
  tourTrips: TourTrip[] = [];
  selectedTrip: TourTrip | null = null;
  tour!: Tour;
  tooltipText: string = '';
  hasTourTrip: boolean = false;
  loading: boolean = true;
  displayTripDialog: boolean = false;
  passengerForm!: FormGroup;
  displayPassengerDialog: boolean = false;

  @ViewChild('tooltip') tooltip!: ElementRef;
  @ViewChild('calendar') calendarElement!: ElementRef;

  dialogRef!: DynamicDialogRef;

  constructor(
    private route: ActivatedRoute,
    private photoService: PhotoService,
    private tourTripService: TourTripService,
    private tourService: TourService,
    private decimalPipe: DecimalPipe,
    private cdr: ChangeDetectorRef,
    private paymentService: PaymentService,
    private fb: FormBuilder,
    public dialogService: DialogService,
    private messageService: MessageService
  ) {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      dateClick: (arg): void => this.handleDateClick(arg),
      eventClassNames:
        'p-button font-bold bg-primary hover:bg-primary-200 border-none shadow-2',
      aspectRatio: 2,
      themeSystem: 'bootstrap5',
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth',
      },
      timeZone: 'UTC',
      eventMouseEnter: (info): void => this.showTooltip(info),
      eventMouseLeave: (): void => this.hideTooltip(),
      eventClick: (info): void => this.handleEventClick(info),
    };
  }

  handleEventClick(info: any): void {
    const clickedEvent = info.event;
    const tripId = clickedEvent.extendedProps.tripId;

    const matchingTrip = this.tourTrips.find(
      trip => trip.tourTripId === tripId,
    );

    if (matchingTrip) {
      this.selectedTrip = matchingTrip;
      this.displayTripDialog = true;
    }
  }

  ngOnInit(): void {
    this.photoService.getImages().then((images: any) => (this.images = images));
    this.responsiveOptions = [
      { breakpoint: '1024px', numVisible: 5 },
      { breakpoint: '768px', numVisible: 3 },
      { breakpoint: '560px', numVisible: 1 },
    ];
    this.passengerForm = this.fb.group({
      numberOfPassengers: [1, [Validators.required, Validators.min(1)]],
    });
    const tourId = this.route.snapshot.paramMap.get('id');
    if (tourId) {
      this.loadTourTrips(tourId);
      this.loadTour(tourId);
    }
  }

  loadTour(tourId: string): void {
    this.tourService.getTourById(Guid.parse(tourId)).subscribe(response => {
      if (response.isSucceed) {
        this.tour = response.result as Tour;
      }
    });
  }

  loadTourTrips(tourId: string): void {
    this.tourTripService.getTourTripsByTourId(tourId).subscribe({
      next: (response: BaseResponse<TourTripResponse>) => {
        this.tourTrips = Array.isArray(response.result?.tourTrips)
          ? response.result.tourTrips
          : [];

        this.hasTourTrip = this.tourTrips.length > 0;

        // Format each tour trip date as "YYYY-MM-DD" without time information
        this.calendarOptions.events = this.tourTrips.map(trip => ({
          title: `${this.formatPrice(trip.price)}đ`,
          date: this.formatDateForCalendar(trip.tripDate!), // Format date as "YYYY-MM-DD"
          extendedProps: {
            price: trip.price,
            totalSeats: trip.totalSeats,
            tripId: trip.tourTripId,
          },
          allDay: true, // Treat as an all-day event
          classNames: ['hover-event'],
        }));
        this.hasTourTrip = true;
        this.cdr.detectChanges();
      },
      error: () => {
        this.hasTourTrip = false;
        this.loading = false;
      },
    });
  }

  handleDateClick(arg: DateClickArg): void {
    const clickedDate = arg.dateStr;
    const matchingTrip = this.tourTrips.find(trip => {
      if (!trip.tripDate) return false;
      const tripDateString = this.formatDateForCalendar(trip.tripDate);
      return tripDateString === clickedDate;
    });

    if (matchingTrip) {
      this.selectedTrip = matchingTrip;
      this.displayTripDialog = true; // Open the dialog
    } else {
      this.selectedTrip = null;
    }
  }

  showTooltip(info: any): void {
    const price = this.formatPrice(info.event.extendedProps.price);
    const totalSeats = info.event.extendedProps.totalSeats;
    this.tooltipText = `Price: ${price}đ\nSeats: ${totalSeats}\n\nClick to select`;

    const tooltipElement = this.tooltip.nativeElement;
    tooltipElement.style.display = 'block';
    tooltipElement.style.left = `${info.jsEvent.pageX + 10}px`;
    tooltipElement.style.top = `${info.jsEvent.pageY + 10}px`;
  }

  hideTooltip(): void {
    const tooltipElement = this.tooltip.nativeElement;
    tooltipElement.style.display = 'none';
  }

  formatDate(date: Date | string): string {
    const parsedDate = new Date(date);
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const year = parsedDate.getFullYear();
    return `${day}/${month}/${year}`;
  }

  calculateDaysAndNights(
    startDate: Date | string,
    endDate: Date | string,
  ): string {
    // Convert startDate and endDate to Date objects if they are strings
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if the conversion to Date was successful
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 'Invalid dates provided';
    }

    // Calculate the difference in time between the two dates
    const differenceInTime = end.getTime() - start.getTime();

    // Calculate the difference in days
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

    // Calculate the number of nights
    const nights = differenceInDays - 1;

    // Format the result as a string
    return `${differenceInDays} days and ${nights} nights`;
  }

  formatDateForCalendar(date: Date | string): string {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Format as "YYYY-MM-DD"
  }

  formatPrice(price: number | undefined): string {
    return this.decimalPipe.transform(price, '1.0-0') || '';
  }

  bookTourTrip(trip: TourTrip): void {
    this.selectedTrip = trip;
    this.displayPassengerDialog = true; // Show the dialog for passenger input
  }

  // Confirms the booking by calling the payment service
  confirmBooking(): void {
    if (this.selectedTrip && this.passengerForm.valid) {
      const numberOfPassengers = this.passengerForm.value.numberOfPassengers;

      this.paymentService
        .createPayment(this.selectedTrip.tourTripId!, numberOfPassengers)
        .subscribe({
          next: response => {
            if (response.isSucceed) {
              window.location.href = response.result as string;
              this.displayPassengerDialog = false;
              this.displayTripDialog = false;
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.message,
              });
            }
          },
          error: error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message,
            });
          },
        });
    }
  }

  getTransportation(transportation: Transportation[]): string {
    return transportation.map((loc: Transportation) => loc.type).join(', ');
  }

  remainingSeats(trip: TourTrip): number {
    return trip.totalSeats! - trip.bookedSeats!;
  }

  getMoods(mood: Mood[]): string {
    return mood.map((m: Mood) => m.moodTag).join(', ');
  }

  goToCalendar(): void {
    if (this.calendarElement) {
      this.calendarElement.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  getLocation(location: Location[]): string {
    return location.map((l: Location) => l.name).join(', ');
  }

  openEmbeddedUrlDialog(url: string): void {
    this.dialogRef = this.dialogService.open(VnpayFormComponent, {
      header: 'VNPAY FORM',
      width: '70%',
      height: '70%',
      data: {
        url: url
      }
    });
  }
}
