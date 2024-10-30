import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { Product } from '../../../../interfaces/models/product';
import { ProductService } from '../../../../services/product.service';
import { SelectItem } from 'primeng/api';
import { Tour } from '../../../../interfaces/models/tour';
import { TourService } from '../../../../services/tour.service';
import { MoodService } from '../../../../services/mood.service';
import { LocationService } from '../../../../services/location.service';
import { MapApiService } from '../../../../services/map-api.service';

@Component({
  selector: 'app-exploration',
  templateUrl: './exploration.component.html',
  providers: [ProductService],
})
export class ExplorationComponent implements OnInit {
  filters: any = {};
  tours: any[] = [];
  layout: 'list' | 'grid' = 'list';
  sortOptions!: SelectItem[];

  sortOrder!: number;

  sortField!: string;
  value!: string;
  loading: boolean = true;

  products!: Product[];
  toursList!: Tour[];

  constructor(
    private commonService: CommonService,
    private productService: ProductService,
    private tourService: TourService,
    private moodService: MoodService,
    private locationService: LocationService,
    private mapApiService: MapApiService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().then((data: Product[]) => {
      setTimeout(() => {
        this.products = data.slice(0, 12);
        this.loading = false;
      }, 2000);
    });

    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' },
    ];
    this.filters = this.commonService.getSearchCriteria();
    console.log('Retrieved filters:', this.filters);

    this.fetchFilteredTours();
  }

  onSortChange(event: any): void {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  fetchFilteredTours(): void {
    this.loading = true;
    this.tourService.getTours(1, 10, this.sortField).subscribe(
      (data) => {
        this.tours = data?.results || [];
        this.loading = false;
      }
    );
  }

  getSeverity(product: Product): any {
    switch (product.inventoryStatus as any) {
      case 'INSTOCK':
        return 'success';

      case 'LOWSTOCK':
        return 'warning';

      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return null;
    }
  }

  counterArray(n: number): any[] {
    return Array(n);
  }
}
