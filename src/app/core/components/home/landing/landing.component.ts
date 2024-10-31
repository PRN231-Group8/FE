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
import { Transportation } from '../../../../interfaces/models/transportation';
import { TransportationService } from '../../../../services/transportation.service';

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
  transportOptions!: Transportation[];

  address: string = '';
  selectedTransport!: string;
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
    private locationService: LocationService,
    private transportationService: TransportationService
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
    this.getAllTransportations();

    this.transportationLoading = false;
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
        this.address = data.display_name;

        // fetch map API to get cities list
        this.mapApiService.getCities().subscribe((mapData: any) => {
          mapData.forEach((map: any) => {
            if (this.address.includes(map.city)) {
              this.selectedFrom = map.city;
            }
          });
          this.locationLoading = false;
        });
      }
    );
  }

  searchTours(): void {
    this.commonService.setSearchCriteria({
      mood: this.moods[this.activeIndex],
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

  getAllTransportations(): void {
    this.transportationService.getTransportations(1, 20).subscribe(
      (data: BaseResponse<Transportation>) => {
        if (data.isSucceed) {
          this.transportOptions = data.results as Transportation[];
        }
      }
    );
  }
}
