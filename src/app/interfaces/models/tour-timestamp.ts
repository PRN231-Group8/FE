import { Guid } from 'guid-typescript';
import { Location } from './location';

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
    location?: Location;
}