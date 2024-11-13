import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription, debounceTime } from 'rxjs';
import { Product } from '../../../interfaces/models/product';
import { LayoutService } from '../../../layout/service/app.layout.service';
import { ProductService } from '../../../services/product.service';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  items!: MenuItem[];
  products!: Product[];
  dailyChartData: any;
  monthlyChartData: any;
  moodData: any;
  dailyChartOptions: any;
  monthlyChartOptions: any;
  polarChartOptions: any;
  dashboardData: any = {};
  orderHistory: any[] = [];
  subscription!: Subscription;
  isLoading = true;
  constructor(
    private productService: ProductService,
    public layoutService: LayoutService,
    private dashboardService: DashboardService,
  ) {
    this.subscription = this.layoutService.configUpdate$
      .pipe(debounceTime(25))
      .subscribe(() => {
        this.initChartOptions();
      });
  }

  ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe(data => {
      this.dashboardData = data;
      this.orderHistory = data.orderHistory || [];
      this.isLoading = false;
      this.initMoodChart();
      this.updateChartData();
    });

    this.productService.getProductsSmall().then((data: Product[]) => {
      this.products = data;
    });

    this.items = [
      { label: 'Add New', icon: 'pi pi-fw pi-plus' },
      { label: 'Remove', icon: 'pi pi-fw pi-minus' },
    ];

    this.initChartOptions();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  updateChartData(): void {
    const dailyLabels = this.dashboardData.earningsByDay.map((entry: any) =>
      new Date(entry.date).toLocaleDateString('en-GB'),
    );
    const dailyEarnings = this.dashboardData.earningsByDay.map(
      (entry: any) => entry.totalEarnings,
    );

    const monthlyLabels = this.dashboardData.earningsByMonth.map(
      (entry: any) => `${entry.month}/${entry.year}`,
    );
    const monthlyEarnings = this.dashboardData.earningsByMonth.map(
      (entry: any) => entry.totalEarnings,
    );

    this.dailyChartData = {
      labels: dailyLabels,
      datasets: [
        {
          label: 'Daily Earnings',
          data: dailyEarnings,
          fill: false,
          backgroundColor: '#4CAF50',
          borderColor: '#4CAF50',
          tension: 0.4,
        },
      ],
    };

    this.monthlyChartData = {
      labels: monthlyLabels,
      datasets: [
        {
          label: 'Monthly Earnings',
          data: monthlyEarnings,
          fill: false,
          backgroundColor: '#FF9800',
          borderColor: '#FF9800',
          tension: 0.4,
        },
      ],
    };
  }

  initMoodChart(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const labels = this.dashboardData.moodUsage.map(
      (item: any) => item.moodTag,
    );
    const data = this.dashboardData.moodUsage.map((item: any) => item.count);

    this.moodData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            documentStyle.getPropertyValue('--red-500'),
            documentStyle.getPropertyValue('--green-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--bluegray-500'),
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--purple-500'),
            documentStyle.getPropertyValue('--pink-500'),
            documentStyle.getPropertyValue('--cyan-500'),
            documentStyle.getPropertyValue('--orange-500'),
            documentStyle.getPropertyValue('--teal-500'),
          ],
          label: 'Mood Usage',
        },
      ],
    };
  }

  initChartOptions(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.dailyChartOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColor,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColor,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

    this.monthlyChartOptions = { ...this.dailyChartOptions };

    this.polarChartOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        r: {
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };
  }
}
