import { Guid } from 'guid-typescript';
export interface TourTrip {
    tourTripId?: Guid;
    tripDate?: Date;
    price?: number;
    totalSeats?: number;
    bookedSeats?: number;
    createdDate?: Date;
    tripStatus?: string;
    tourId?: Guid;
}