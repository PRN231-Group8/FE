import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

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

  constructor(private router: Router, private route : ActivatedRoute, private location: Location) {}

  navigateTo(url: string): void {
    this.router.navigate([url], { relativeTo: this.route });
  }
}
