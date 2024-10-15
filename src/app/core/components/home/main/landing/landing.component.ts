import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxAnimatedCounterParams } from '@bugsplat/ngx-animated-counter';
import { PrimeNGConfig } from 'primeng/api';
import { CommonService } from '../../../../../services/common.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
})
export class LandingComponent implements OnInit {

  value: number = 4;
  public params: NgxAnimatedCounterParams = { start: 20, end: 198021, interval: 40, increment: 9319 };
  public params_2: NgxAnimatedCounterParams = { start: 0, end: 27857, interval: 40, increment: 1950 };

  activeIndex: number = 0;
  selectedFrom: any;
  selectedTo: any;
  priceRange: number = 1000000; // default: 1m VNĐ
  selectedTransport: string = 'Car (4 seats)';
  locationLoading: boolean = true;
  transportationLoading: boolean = true;
  moods!: any[];
  locations!: any[];
  transportOptions!: any[];

  constructor(
    private commonService: CommonService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
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

    // Mock data for locations and transport options
    this.locations = [
      { name: 'Hanoi' },
      { name: 'Ho Chi Minh City' },
      { name: 'Da Nang' },
      { name: 'Hue' },
    ];
    this.locationLoading = false;

    this.transportOptions = [
      { label: 'Car (4 seats)', value: 'Car (4 seats)' },
      { label: 'Bus', value: 'Bus' },
      { label: 'Motorbike', value: 'Motorbike' },
    ];
    this.transportationLoading = false;
  }

  // Function to search tours based on user inputs
  searchTours(): void {
    // Save user inputs in the shared service
    this.commonService.setSearchCriteria({
      mood: this.moods[this.activeIndex].title,
      from: this.selectedFrom,
      to: this.selectedTo,
      priceRange: this.priceRange,
      transport: this.selectedTransport,
    });

    this.navigateTo('/explore');
  }

  navigateTo(url: string): void {
    this.router.navigate([url], { relativeTo: this.route });
  }
}
