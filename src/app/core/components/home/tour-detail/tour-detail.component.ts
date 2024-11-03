import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { Tour } from '../../../../interfaces/models/tour';
import { Guid } from 'guid-typescript';

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

  constructor(
    private route: ActivatedRoute,
    private photoService: PhotoService,
    private tourTripService: TourTripService,
    private tourService: TourService,
    private decimalPipe: DecimalPipe,
    private cdr: ChangeDetectorRef
  ) {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      dateClick: (arg): void => this.handleDateClick(arg),
      timeZone: 'UTC',
      eventClassNames: 'p-button bg-primary border-none shadow-2 p-ripple',
      events: [],
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
    this.tourService.getTourById(Guid.parse(tourId)).subscribe(
      (response) => {
        if (response.isSucceed) {
          this.tour = response.result as Tour;
          console.log(this.tour);
        }
      }
    );
  }

  loadTourTrips(tourId: string): void {
    this.tourTripService.getTourTripsByTourId(tourId).subscribe({
      next: (response: BaseResponse<TourTripResponse>) => {
        this.tourTrips = Array.isArray(response.result?.tourTrips)
          ? response.result.tourTrips
          : [];
        this.calendarOptions.events = this.tourTrips.map(trip => ({
          title: `${this.formatPrice(trip.price)} VND`,
          date: trip.tripDate,
          extendedProps: { trip },
        }));
        this.cdr.detectChanges();
      },
      error: err => console.error('Error fetching tour trips:', err),
    });
  }

  handleDateClick(arg: DateClickArg): void {
    const clickedDate = arg.dateStr;
    const matchingTrip = this.tourTrips.find(trip => {
      if (!trip.tripDate) return false;
      console.log(trip.tripDate);
      const tripDateString = new Date(trip.tripDate)
        .toISOString()
        .split('T')[0];
        console.log('Trip Date: ', tripDateString);
        console.log('Clicked Date: ', clickedDate);
      return tripDateString === clickedDate;
    });
    console.log(matchingTrip);
    if (matchingTrip) {
      this.selectedTrip = matchingTrip;
    } else {
      this.selectedTrip = null;
    }
  }

  formatDate(date: Date | string): string {
    const parsedDate = new Date(date);
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const year = parsedDate.getFullYear();
    return `${day}/${month}/${year}`;
  }

  formatPrice(price: number | undefined): string {
    return this.decimalPipe.transform(price, '1.0-0') || '';
  }
}
