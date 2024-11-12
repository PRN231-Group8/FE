import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @ViewChild('menu') menu!: Menu;

  items: MenuItem[] = [];
  lastName: any;
  firstName: any;
  role: any;
  isLoggedIn: boolean = false;
  defaultAvatarPath: string =
    'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1';
  avatarPath: string | null = null;
  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
  ) {}

  NAV_LINKS = [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'explore', label: 'Explore', href: '/explore' },
    { key: 'sharing', label: 'Sharing', href: '/sharing-post' },
    { key: 'contact', label: 'Contact', href: '/contact' },
  ];

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.isLoggedIn = !!user?.token;

    if (this.isLoggedIn && user?.email) {
      this.userService.getUserByEmail(user.email).subscribe(response => {
        const userProfile = response.result;
        this.firstName = userProfile?.firstName || 'Unknown';
        this.lastName = userProfile?.lastName || 'Unknown';
        this.role = userProfile?.role || 'User';
        this.avatarPath = userProfile?.avatarPath || this.defaultAvatarPath;
      });
    }
    this.updateMenuItems();
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
      if (this.role === 'ADMIN') {
        this.items = [
          {
            label: 'Managements',
            items: [
              {
                label: 'My Trips',
                icon: 'pi pi-car',
                shortcut: '⌘+N',
                command: (): void => {
                  this.router.navigate(['/order']);
                },
              },
              {
                label: 'My Managements',
                icon: 'pi pi-briefcase',
                shortcut: '⌘+S',
                command: (): void => {
                  this.router.navigate(['/dashboard']);
                },
              },
            ],
          },
          {
            label: 'Profile',
            items: [
              {
                label: 'My Profile',
                icon: 'pi pi-spin pi-cog',
                shortcut: '⌘+O',
                command: (): void => {
                  this.router.navigate(['/profile']);
                },
              },
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
      } else {
        this.items = [
          {
            label: 'Managements',
            items: [
              {
                label: 'My Trips',
                icon: 'pi pi-car',
                shortcut: '⌘+N',
                command: (): void => {
                  this.router.navigate(['/order']);
                },
              },
            ],
          },
          {
            label: 'Profile',
            items: [
              {
                label: 'My Profile',
                icon: 'pi pi-spin pi-cog',
                shortcut: '⌘+O',
                command: (): void => {
                  this.router.navigate(['/profile']);
                },
              },
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
