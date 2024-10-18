import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { Product } from '../../../../interfaces/models/product';
import { ProductService } from '../../../../services/product.service';
import { SelectItem } from 'primeng/api';

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

  constructor(
    private commonService: CommonService,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    // Fetch the products and simulate a delay for loading state
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
    // Retrieve filters from the shaxred service
    this.filters = this.commonService.getSearchCriteria();
    console.log('Retrieved filters:', this.filters);

    // Use these filters to fetch filtered tours (mock or API call)
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
    this.tours = [
      { name: 'Tour 1', price: 1000000, transport: 'Car (4 seats)' },
      { name: 'Tour 2', price: 1500000, transport: 'Bus' },
    ];
    console.log('Displaying filtered tours:', this.tours);
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
