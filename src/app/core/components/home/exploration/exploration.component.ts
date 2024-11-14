import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { ProductService } from '../../../../services/product.service';
import { TourService } from '../../../../services/tour.service';
import { MoodService } from '../../../../services/mood.service';
import { LocationService } from '../../../../services/location.service';
import { BaseResponse } from '../../../../interfaces/models/base-response';
import { Mood } from '../../../../interfaces/models/mood';
import { HttpClient } from '@angular/common/http';
import { MapApiService } from '../../../../services/map-api.service';
import { Tour } from '../../../../interfaces/models/tour';
import { Transportation } from '../../../../interfaces/models/transportation';
import { TransportationService } from '../../../../services/transportation.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { Location } from '../../../../interfaces/models/location';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-exploration',
  templateUrl: './exploration.component.html',
  providers: [ProductService, DatePipe, DecimalPipe],
})
export class ExplorationComponent implements OnInit, OnDestroy {
  filters: any = {};
  tours!: Tour[];
  layout: 'list' | 'grid' = 'list';
  sortOrder: number = 1;
  sortField: string = 'price';
  loading: boolean = true;
  locationLoading: boolean = true;
  lat: number = 0.0;
  lng: number = 0.0;
  address: string = '';
  otherAddress: string = '';

  // Filter data for dropdowns
  locations!: Location[];
  moods!: Mood[];
  selectedFrom!: string;
  selectedTo!: string;
  priceRange: number = 0;
  transports!: Transportation[];
  selectedTransport!: string;
  selectedMood!: string;
  private toursSubscription: Subscription | null = null;
  fromPlaceholder = this.selectedFrom
    ? this.selectedFrom
    : 'Finding your nearby city';

  constructor(
    private commonService: CommonService,
    private tourService: TourService,
    private moodService: MoodService,
    private locationService: LocationService,
    private mapApiService: MapApiService,
    private transportationService: TransportationService,
    private http: HttpClient,
    private decimalPipe: DecimalPipe,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    // Retrieve saved filters from CommonService if they exist
    this.filters = this.commonService.getSearchCriteria() || null;
    if (this.filters.from) {
      this.selectedFrom = this.filters.from;
      this.fromPlaceholder = this.filters.from;
      this.locationLoading = false;
    } else {
      this.getLocation();
    }
    this.selectedTo = this.filters.to || null;
    this.priceRange = this.filters.priceRange || null;
    this.selectedTransport = this.filters.transport || null;
    this.selectedMood = this.filters.mood || null;

    this.initializeMoods();
    this.initializeLocations();
    this.initializeTransportations();
    await this.getTourSubscription();
  }

  async getTourSubscription(): Promise<void> {
    // Subscribe to tours from CommonService
    this.toursSubscription = this.commonService
      .getTours()
      .subscribe(async storedTours => {
        if (storedTours) {
          // If tours are already stored, use them
          this.tours = storedTours;
          await this.applyFilters();
        } else {
          // Fetch tours if not stored
          this.fetchAndStoreTours();
        }
        this.loading = false;
      });
  }

  initializeMoods(): void {
    if (this.filters.moods) {
      this.moods = this.filters.moods;
    } else {
      this.moodService.getMoods(1, 20).subscribe((data: BaseResponse<Mood>) => {
        if (data.isSucceed) {
          this.moods = data.results as Mood[];
        }
      });
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) {
      return ''; // Return an empty string if the date is undefined
    }
    const parsedDate = new Date(date);
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = parsedDate.getFullYear();
    return `${day}/${month}/${year}`;
  }

  formatPrice(price: number | undefined): string {
    return this.decimalPipe.transform(price, '1.0-0') || '';
  }

  initializeTransportations(): void {
    this.transportationService
      .getTransportations(1, 20)
      .subscribe((data: BaseResponse<Transportation>) => {
        if (data.isSucceed) {
          this.transports = data.results as Transportation[];
        }
      });
  }

  initializeLocations(): void {
    if (this.filters.locations) {
      this.locations = this.filters.locations;
    } else {
      this.locationService
        .getLocations(1, 20)
        .subscribe((data: BaseResponse<Location>) => {
          if (data.isSucceed) {
            this.locations = data.results as Location[];
          }
        });
    }
  }

  fetchAndStoreTours(): void {
    this.tourService.getTours(1, 100).subscribe(data => {
      if (data.isSucceed) {
        this.tours = data.results as Tour[];
        this.commonService.setTours(this.tours); // Store fetched tours
      }
      this.loading = false;
    });
  }
  sortTours(): void {
    if (this.sortField) {
      this.tours.sort((a: any, b: any) => {
        const valueA = a[this.sortField];
        const valueB = b[this.sortField];

        if (valueA < valueB) return this.sortOrder === 1 ? -1 : 1;
        if (valueA > valueB) return this.sortOrder === 1 ? 1 : -1;
        return 0;
      });
    }
  }

  onSortChange(event: any): void {
    const value = event.value;
    this.sortOrder = value.startsWith('!') ? -1 : 1;
    this.sortField = value.replace('!', '');

    // Sort tours on the front end based on new sort field and order
    this.sortTours();
  }

  async applyFilters(): Promise<void> {
    this.toursSubscription = this.commonService
      .getTours()
      .subscribe(storedTours => {
        if (storedTours) {
          this.tours = storedTours;
        }
      });

    // Set filter criteria in common service
    this.commonService.setSearchCriteria({
      mood: this.selectedMood,
      from: this.selectedFrom,
      to: this.selectedTo,
      priceRange: this.priceRange,
      transport: this.selectedTransport,
    });

    const filters = this.commonService.getSearchCriteria();

    if (this.tours) {
      this.tours = this.tours.filter(tour => {
        // Price Range Filter
        if (
          filters.priceRange &&
          tour.totalPrice !== null &&
          tour.totalPrice! < filters.priceRange
        ) {
          return false;
        }

        // Location Filter
        if (filters.to) {
          const locationNames =
            tour.locationInTours?.map((location: Location) =>
              location.name?.toLowerCase(),
            ) || [];
          if (!locationNames.includes(filters.to.name.toLowerCase())) {
            return false;
          }
        }

        // Transportation Filter
        if (filters.transport) {
          const transportTypes =
            tour.transportations?.map(
              (transportation: Transportation) => transportation.type,
            ) || [];
          if (!transportTypes.includes(filters.transport.type)) {
            return false;
          }
        }

        // Mood Filter
        if (filters.mood) {
          const tourMoodTags =
            tour.tourMoods?.map((mood: Mood) => mood.moodTag) || [];
          if (!tourMoodTags.includes(filters.mood.moodTag)) {
            return false;
          }
        }

        return true;
      });
    }
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          if (position) {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            this.reverseGeocode();
          }
        },
        () => {
          alert(
            'You should provide us your location to have better experience.',
          );
        },
      );
    } else {
      alert('You should provide us your location to have better experience.');
    }
  }

  reverseGeocode(): void {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.lat}&lon=${this.lng}&zoom=10&addressdetails=1`;

    this.http.get<any>(url).subscribe(
      data => {
        this.address = data.display_name;

        // fetch map API to get cities list
        this.mapApiService.getCities().subscribe((mapData: any) => {
          mapData.forEach((map: any) => {
            if (this.address.includes(map.city) || this.address.includes(map.admin_name)) {
              this.selectedFrom = map.city;
              this.fromPlaceholder = map.admin_name;
            }
          });
          this.locationLoading = false;
        });
      },
      error => {
        console.error('Error fetching location data:', error);
        this.locationLoading = false;
      },
    );
  }

  removeFilter(): void {
    this.commonService.setSearchCriteria({});
    this.fetchAndStoreTours();
  }

  getLocationPhotoUrl(item: any): string {
    return (
      item.locationInTours?.[0]?.photos?.[0]?.url ||
      'https://www.shoreexcursionsgroup.com/img/tour/EUMRCASBAN-2.jpg'
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.toursSubscription) {
      this.toursSubscription.unsubscribe();
    }
  }

  goToTourDetail(id: Guid): void {
    this.router.navigate([`tour-detail/${id}`]);
  }
}
