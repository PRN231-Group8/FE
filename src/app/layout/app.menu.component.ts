import { Component, OnInit } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { User } from '../interfaces/models/user';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];
  user!: User | null;

  constructor(public layoutService: LayoutService) {
  }

  ngOnInit(): void {
    this.model = [
      {
        label: 'Home',
        items: [
          { label: 'Home Page', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
          {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-chart-line',
            routerLink: ['/dashboard'],
          },
        ],
      },
      {
        label: 'Management',
        icon: 'pi pi-fw pi-briefcase',
        items: [
          {
            label: 'Tour Management',
            icon: 'pi pi-fw pi-pencil',
            routerLink: ['admin/tour'],
          },
          {
            label: 'Location Management',
            icon: 'pi pi-fw pi-map-marker',
            routerLink: ['admin/location'],
          },
          {
            label: 'Transportation Management',
            icon: 'pi pi-fw pi-truck',
            routerLink: ['admin/transportation'],
          },
        ],
      },
    ];
  }
}
