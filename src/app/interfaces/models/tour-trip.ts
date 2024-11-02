import { Guid } from 'guid-typescript';

export interface TourTrip {
    id?: Guid;
    tripDate?: Date;
    price?: number;
    totalSeats?: number;
    bookedSeats?: number;
    tripStatus?: string;
    tourId?: Guid;
}