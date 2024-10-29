/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable } from '@angular/core';

@Injectable()
export class PhotoService {
  getData() {
    return [
      {
        itemImageSrc:
          'https://scontent.fsgn2-8.fna.fbcdn.net/v/t39.30808-6/448020293_429665739865219_3926277619316235116_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeF18YuPrhzzQnQs4o4NaCGBU9ho8O3oOt9T2Gjw7eg63zKXwbCxB_xNfQtupqDozqaKMdVvgGufGy_SXsVCFgbt&_nc_ohc=k45mfNkGPfgQ7kNvgFLEXcF&_nc_zt=23&_nc_ht=scontent.fsgn2-8.fna&_nc_gid=A-SZyG63UFYLuf3X9UuPe24&oh=00_AYC2mN0LYQVUjQ9N0mehudiIRFQ8YCl7AUa56ElnLdeucQ&oe=671D4D6C',
        thumbnailImageSrc:
          'https://scontent.fsgn2-8.fna.fbcdn.net/v/t39.30808-6/448020293_429665739865219_3926277619316235116_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeF18YuPrhzzQnQs4o4NaCGBU9ho8O3oOt9T2Gjw7eg63zKXwbCxB_xNfQtupqDozqaKMdVvgGufGy_SXsVCFgbt&_nc_ohc=k45mfNkGPfgQ7kNvgFLEXcF&_nc_zt=23&_nc_ht=scontent.fsgn2-8.fna&_nc_gid=A-SZyG63UFYLuf3X9UuPe24&oh=00_AYC2mN0LYQVUjQ9N0mehudiIRFQ8YCl7AUa56ElnLdeucQ&oe=671D4D6C',
        alt: 'Description for Image 1',
        title: 'Title 1',
      },
      {
        itemImageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria2.jpg',
        thumbnailImageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria2s.jpg',
        alt: 'Description for Image 2',
        title: 'Title 2',
      },
      {
        itemImageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria3.jpg',
        thumbnailImageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria3s.jpg',
        alt: 'Description for Image 3',
        title: 'Title 3',
      },
    ];
  }

  getImages() {
    return Promise.resolve(this.getData());
  }
}
