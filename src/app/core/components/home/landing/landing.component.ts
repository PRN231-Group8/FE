import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxAnimatedCounterParams } from '@bugsplat/ngx-animated-counter';
import { PrimeNGConfig } from 'primeng/api';
import { CommonService } from '../../../../services/common.service';
import { ProductService } from '../../../../services/product.service';
import { HttpClient } from '@angular/common/http';
import { MapApiService } from '../../../../services/map-api.service';

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

  moods!: any[];
  locations!: any[];
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
    // fetch api here
    this.moods = [
      {
        title: 'Happy',
        icon: 'pi pi-face-smile',
        description: 'Feeling joyous and content',
      },
      {
        title: 'Angry',
        icon: 'pi pi-bolt',
        description: 'Feeling frustration or anger',
      },
      {
        title: 'Sad',
        icon: 'pi pi-thumbs-down',
        description: 'Feeling down or upset',
      },
      {
        title: 'Confident',
        icon: 'pi pi-star',
        description: 'Feeling sure and determined',
      },
      {
        title: 'Excited',
        icon: 'pi pi-sparkles',
        description: 'Feeling full of energy',
      },
      {
        title: 'Shy',
        icon: 'pi pi-question',
        description: 'Feeling reserved or nervous',
      },
      {
        title: 'Bored',
        icon: 'pi pi-circle-off',
        description: 'Feeling uninterested or weary',
      },
      {
        title: 'Stressed',
        icon: 'pi pi-exclamation-triangle',
        description: 'Feeling overwhelmed or tense',
      },
    ];

    this.locations = [
      { name: 'Hanoi' },
      { name: 'Ho Chi Minh City' },
      { name: 'Da Nang' },
      { name: 'Hue' },
    ];

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
        (error: GeolocationPositionError) => console.log(error),
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
            if (this.address.includes(map.admin_name)) {
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
      mood: this.moods[this.activeIndex].title,
      from: this.selectedFrom,
      to: this.selectedTo,
      priceRange: this.priceRange,
      transport: this.selectedTransport,
    });

    this.router.navigate(['/explore']);
  }
}
