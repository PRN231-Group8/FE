import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { ProductService } from '../../../../services/product.service';
import { TourService } from '../../../../services/tour.service';
import { MoodService } from '../../../../services/mood.service';
import { LocationService } from '../../../../services/location.service';
import { SelectItem } from 'primeng/api';
import { BaseResponse } from '../../../../interfaces/models/base-response';
import { Mood } from '../../../../interfaces/models/mood';
import { Location } from '../../../../interfaces/models/location';
import { HttpClient } from '@angular/common/http';
import { MapApiService } from '../../../../services/map-api.service';
import { Tour } from '../../../../interfaces/models/tour';

@Component({
  selector: 'app-exploration',
  templateUrl: './exploration.component.html',
  providers: [ProductService],
})
export class ExplorationComponent implements OnInit {
  filters: any = {};
  tours!: Tour[];
  layout: 'list' | 'grid' = 'list';
  sortOptions!: SelectItem[];
  sortOrder: number = 1;
  sortField: string = 'price';
  loading: boolean = true;
  locationLoading: boolean = true;
  lat: number = 0.0;
  lng: number = 0.0;
  address: string = '';

  // Filter data for dropdowns
  locations!: Location[];
  moods!: Mood[];
  selectedFrom: string | null = null;
  selectedTo: string | null = null;
  priceRange: number | null = null;
  transportOptions: SelectItem[] = [];
  selectedTransport: string | null = null;
  selectedMood: string | null = null;

  constructor(
    private commonService: CommonService,
    private tourService: TourService,
    private moodService: MoodService,
    private locationService: LocationService,
    private mapApiService: MapApiService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.selectedFrom = null;
    this.selectedTo = null;
    this.priceRange = null;
    this.selectedTransport = null;
    this.selectedMood = null;
    // Retrieve saved filters from CommonService if they exist
    this.filters = this.commonService.getSearchCriteria() || {};
    console.log(this.filters);
    if (this.filters.from) {
      this.selectedFrom = this.filters.from;
    } else {
      this.getLocation();
    }
    this.selectedTo = this.filters.to || null;
    this.priceRange = this.filters.priceRange || null;
    this.selectedTransport = this.filters.transport || null;
    this.selectedMood = this.filters.mood || null;

    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' },
    ];
    this.transportOptions = [
      { label: 'Car (4 seats)', value: 'Car (4 seats)' },
      { label: 'Bus', value: 'Bus' },
      { label: 'Motorbike', value: 'Motorbike' },
    ];

    this.sortField = this.sortOptions[0]?.value.replace('!', '') || 'price';

    this.initializeMoods();
    this.initializeLocations();

    this.fetchFilteredTours();
  }

  initializeMoods(): void {
    if (this.filters.moods) {
      // Use the filtered moods from CommonService
      this.moods = this.filters.moods;
    } else {
      // Fetch all moods if not filtered
      this.moodService.getMoods(1, 20).subscribe((data: BaseResponse<Mood>) => {
        if (data.isSucceed) {
          this.moods = data.results as Mood[];
        }
      });
    }
  }

  initializeLocations(): void {
    if (this.filters.locations) {
      this.locations = this.filters.locations;
      this.locationLoading = false;
    } else {
      this.locationService
        .getLocations(1, 20)
        .subscribe((data: BaseResponse<Location>) => {
          if (data.isSucceed) {
            this.locations = data.results as Location[];
          }
        });
        this.locationLoading = false;
    }
  }

  fetchFilteredTours(): void {
    this.commonService.setSearchCriteria({
      mood: this.selectedMood,
      from: this.selectedFrom,
      to: this.selectedTo,
      priceRange: this.priceRange,
      transport: this.selectedTransport,
    });

    this.tourService.getTours(1, 10).subscribe((data: BaseResponse<Tour>) => {
      this.tours = data?.results as Tour[];
      this.loading = false;

      // Apply filters after fetching tours
      this.applyFilters();
      this.sortTours();
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

  applyFilters(): void {
    const filters = this.commonService.getSearchCriteria();

    this.tours = this.tours.filter(tour => {
      if (
        filters.priceRange &&
        tour.totalPrice !== null &&
        !tour.totalPrice <= filters.priceRange
      ) {
        return false;
      }

      // if (
      //   filters.from &&
      //   (!tour.locationInTours ||
      //     !tour.locationInTours.some((loc: Location) =>
      //       loc.name?.includes(filters.from),
      //     ))
      // ) {
      //   return false;
      // }

      // Filter by 'To' location
      // FIXME: Null o tren tour json
      // if (
      //   filters.to &&
      //   (!tour.locationInTours ||
      //     !tour.locationInTours.some((loc: Location) =>
      //       loc.name?.includes(filters.to.name),
      //     ))
      // ) {
      //   console.log('to: false');
      //   return false;
      // }

      // if (
      //   filters.transport &&
      //   (!tour.transportations ||
      //     !tour.transportations.some(
      //       (transport: Transportation) => transport.type === filters.transport,
      //     ))
      // ) {
      //   return false;
      // }

      if (filters.mood) {
        const tourMoodTags =
          tour.tourMoods?.map((mood: Mood) => mood.moodTag) || [];

        if (!tourMoodTags.includes(filters.mood.moodTag)) {
          console.log('mood: false');
          return false;
        }
      }

      return true;
    });
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          if (position) {
            console.log(
              'Latitude: ' +
                position.coords.latitude +
                'Longitude: ' +
                position.coords.longitude,
            );
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            this.reverseGeocode();
          }
        },
        (error: GeolocationPositionError) => {
          console.log(error);
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
        console.log(data);
        this.address = data.display_name;
        console.log('Current city:', this.address);

        // fetch map API to get cities list
        this.mapApiService.getCities().subscribe((mapData: any) => {
          mapData.forEach((map: any) => {
            if (this.address.includes(map.city)) {
              this.selectedFrom = map.city;
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
    this.ngOnInit();
  }
}
