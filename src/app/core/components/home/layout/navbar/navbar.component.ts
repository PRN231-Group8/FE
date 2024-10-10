import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  NAV_LINKS = [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'explore', label: 'Explore', href: '/explore' },
    { key: 'sharing', label: 'Sharing', href: '/share' },
    { key: 'contact', label: 'Contact', href: '/contact' },
  ];
}
