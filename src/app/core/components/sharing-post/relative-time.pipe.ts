import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime',
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: Date | string | number): string {
    const now = new Date().getTime();
    const time = new Date(value).getTime();
    const differenceInSeconds = Math.floor((now - time) / 1000);

    if (differenceInSeconds < 60) {
      return 'Just now';
    } else if (differenceInSeconds < 3600) {
      // Less than an hour
      const minutes = Math.floor(differenceInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (differenceInSeconds < 86400) {
      // Less than a day
      const hours = Math.floor(differenceInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (differenceInSeconds < 604800) {
      // Less than a week
      const days = Math.floor(differenceInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (differenceInSeconds < 2592000) {
      // Less than a month
      const weeks = Math.floor(differenceInSeconds / 604800);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (differenceInSeconds < 31536000) {
      // Less than a year
      const months = Math.floor(differenceInSeconds / 2592000);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(differenceInSeconds / 31536000);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  }
}
