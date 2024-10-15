import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  FOOTER_LINKS = [
    {
      title: 'Company',
      links: ['About Us', 'Careers', 'Press']
    },
    {
      title: 'Resources',
      links: ['Blog', 'Help Center', 'Contact']
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Service']
    }
  ];

  SOCIALS = {
    title: 'Follow Us',
    links: [
      'assets/layout/images/facebook.svg',
      'assets/layout/images/instagram.svg',
      'assets/layout/images/youtube.svg'
    ]
  };

  FOOTER_CONTACT_INFO = {
    title: 'Contact Us',
    links: [
      { label: 'Email', value: 'lehai112003@gmail.com' },
      { label: 'Phone', value: '0963500436' }
    ]
  };
}
