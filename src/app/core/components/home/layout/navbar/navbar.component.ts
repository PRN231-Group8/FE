import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu, MenuModule } from 'primeng/menu';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    MenuModule,
    AvatarModule,
    BadgeModule,
    ButtonModule,
    RippleModule,
    BrowserAnimationsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NavbarComponent implements OnInit {
  @ViewChild('menu') menu!: Menu;

  items: MenuItem[] = [];
  lastName: any;
  firstName: any;
  role: any;
  isLoggedIn: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {}

  NAV_LINKS = [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'about', label: 'About Us', href: '/about' },
    { key: 'services', label: 'Services', href: '/services' },
    { key: 'contact', label: 'Contact', href: '/contact' },
  ];

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.isLoggedIn = !!user?.token;
    if (this.isLoggedIn) {
      this.firstName = user?.firstName || 'Unknown';
      this.lastName = user?.lastName || 'Unknown';
      this.role = user?.role || 'User';
    }
    this.updateMenuItems();

    // Add event listener for window resize to handle responsiveness
    window.addEventListener('resize', this.updateMenuItems.bind(this));
  }

  updateMenuItems(): void {
    // Remove "Menu" if it exists
    this.items = this.items.filter(item => item.label !== 'Menu');

    // Add NAV_LINKS when window width is small
    if (window.innerWidth <= 768) {
      this.items.unshift({
        label: 'Menu',
        items: [...this.NAV_LINKS],
      });
    } else {
      this.items = [
        {
          label: 'Managements',
          items: [
            { label: 'My Trips', icon: 'pi pi-car', shortcut: '⌘+N' },
            {
              label: 'My Managements',
              icon: 'pi pi-briefcase',
              shortcut: '⌘+S',
            },
          ],
        },
        {
          label: 'Profile',
          items: [
            { label: 'My Profile', icon: 'pi pi-spin pi-cog', shortcut: '⌘+O' },
            { label: 'Messages', icon: 'pi pi-inbox', badge: '2' },
            {
              label: 'Logout',
              icon: 'pi pi-sign-out',
              command: (): void => this.logOut(),
              shortcut: '⌘+Q',
            },
          ],
        },
      ];
    }
  }

  toggleMenu(event: Event): void {
    this.menu.toggle(event);
  }

  logOut(): void {
    this.authenticationService.logOut();
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
