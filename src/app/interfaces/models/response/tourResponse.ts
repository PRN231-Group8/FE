import { TourTrip } from '../tour-trip';

export interface TourResponse {
    id: string;
    code: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    status: string;
    title: string;
    description: string;
    tourTrips: TourTrip[];
  }