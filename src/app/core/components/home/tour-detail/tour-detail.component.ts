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

@Component({
  selector: 'app-tour-detail',
  templateUrl: './tour-detail.component.html',
  providers: [DecimalPipe],
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
  @ViewChild('tooltip') tooltip!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private photoService: PhotoService,
    private tourTripService: TourTripService,
    private tourService: TourService,
    private decimalPipe: DecimalPipe,
    private cdr: ChangeDetectorRef,
    private paymentService: PaymentService,
  ) {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      dateClick: (arg): void => this.handleDateClick(arg),
      eventClassNames: 'bg-primary border-none shadow-2',
      events: [],
      aspectRatio: 1,
      themeSystem: 'bootstrap5',
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridWeek,dayGridDay',
      },
      eventMouseEnter: (info): void => this.showTooltip(info),
      eventMouseLeave: (): void => this.hideTooltip(),
    };
  }

  ngOnInit(): void {
    this.photoService.getImages().then((images: any) => (this.images = images));
    this.responsiveOptions = [
      { breakpoint: '1024px', numVisible: 5 },
      { breakpoint: '768px', numVisible: 3 },
      { breakpoint: '560px', numVisible: 1 },
    ];

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
        this.calendarOptions.events = this.tourTrips.map(trip => ({
          title: `${this.formatPrice(trip.price)}đ`,
          date: this.formatDateForCalendar(trip.tripDate!),
          extendedProps: { price: trip.price, totalSeats: trip.totalSeats },
        }));
        this.cdr.detectChanges();
        this.hasTourTrip = true;
      },
      error: () => {
        this.hasTourTrip = true;
      },
    });
  }

  handleDateClick(arg: DateClickArg): void {
    const clickedDate = arg.dateStr;
    const matchingTrip = this.tourTrips.find(trip => {
      if (!trip.tripDate) return false;
      const tripDateString = new Date(trip.tripDate)
        .toISOString()
        .split('T')[0];
      return tripDateString === clickedDate;
    });
    this.selectedTrip = matchingTrip || null;
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

  formatDateForCalendar(date: Date): string {
    const parsedDate = new Date(date);
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const year = parsedDate.getFullYear();
    return `${year}-${month}-${day}`;
  }

  formatPrice(price: number | undefined): string {
    return this.decimalPipe.transform(price, '1.0-0') || '';
  }

  bookTourTrip(tourTrip: TourTrip): void {
    this.paymentService.createPayment(tourTrip.tourTripId!).subscribe({
      next: data => {
        window.open(data.result);
      },
      error: data => {
        console.error(data);
      },
    });
  }
}
