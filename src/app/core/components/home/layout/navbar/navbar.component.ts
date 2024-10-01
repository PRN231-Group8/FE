import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  NAV_LINKS = [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'about', label: 'About Us', href: '/about' },
    { key: 'services', label: 'Services', href: '/services' },
    { key: 'contact', label: 'Contact', href: '/contact' },
  ];
}
