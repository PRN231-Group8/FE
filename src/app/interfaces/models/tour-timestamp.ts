import { Guid } from 'guid-typescript';

export interface TimeSlot {
    startTime: string;
    endTime: string;
}

export interface TourTimestamp {
    id?: Guid;
    title?: string;
    description?: string;
    tourId?: Guid;
    preferredTimeSlot: TimeSlot;
    locationId?: Guid;
}