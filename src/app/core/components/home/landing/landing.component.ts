import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxAnimatedCounterParams } from '@bugsplat/ngx-animated-counter';
import { PrimeNGConfig } from 'primeng/api';
import { CommonService } from '../../../../services/common.service';
import { ProductService } from '../../../../services/product.service';
import { HttpClient } from '@angular/common/http';
import { MapApiService } from '../../../../services/map-api.service';
import { MoodService } from '../../../../services/mood.service';
import { Mood } from '../../../../interfaces/models/mood';
import { BaseResponse } from '../../../../interfaces/models/base-response';
import { LocationService } from '../../../../services/location.service';
import { Location } from '../../../../interfaces/models/location';

@Component({
  selector: 'app-home',
  templateUrl: './landing.component.html',
  providers: [ProductService],
})
export class LandingComponent implements OnInit {
  public params: NgxAnimatedCounterParams = {
    start: 20,
    end: 198021,
    interval: 40,
    increment: 9319,
  };
  public params_2: NgxAnimatedCounterParams = {
    start: 0,
    end: 27857,
    interval: 40,
    increment: 1950,
  };

  value: number = 4;
  activeIndex: number = 0;
  priceRange: number = 1000000; // default: 1m VNĐ
  lat: number = 0.0;
  lng: number = 0.0;

  selectedFrom: any;
  selectedTo: any;

  moods!: Mood[];
  locations!: Location[];
  transportOptions!: any[];

  address: string = '';
  selectedTransport: string = 'Car (4 seats)';
  citySuggestion: any[] | undefined;

  locationLoading: boolean = true;
  transportationLoading: boolean = true;

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private mapApiService: MapApiService,
    private moodService: MoodService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.getLocation();
    this.primengConfig.zIndex = {
      modal: 1100,
      overlay: 1000,
      menu: 1000,
      tooltip: 1100,
      body: 100,
    };
    this.getAllMoods();
    this.getAllLocations();

    this.transportOptions = [
      { label: 'Car (4 seats)', value: 'Car (4 seats)' },
      { label: 'Bus', value: 'Bus' },
      { label: 'Motorbike', value: 'Motorbike' },
    ];
    this.transportationLoading = false;
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
          alert('You should provide us your location to have better experience.');
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

  searchTours(): void {
    this.commonService.setSearchCriteria({
      mood: this.moods[this.activeIndex].moodTag,
      from: this.selectedFrom,
      to: this.selectedTo,
      priceRange: this.priceRange,
      transport: this.selectedTransport,
    });

    this.router.navigate(['/explore']);
  }

  getAllMoods(): void {
    this.moodService.getMoods(1, 20).subscribe(
      (data: BaseResponse<Mood>) => {
        if (data.isSucceed) {
          this.moods = data.results as Mood[];
        }
      }
    );
  }

  getAllLocations(): void {
    this.locationService.getLocations(1, 20).subscribe(
      (data: BaseResponse<Location>) => {
        if (data.isSucceed) {
          this.locations = data.results as Location[];
        }
      }
    );
  }
}
