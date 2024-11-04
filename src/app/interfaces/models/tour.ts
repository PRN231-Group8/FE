import { Guid } from 'guid-typescript';
import { Transportation } from './transportation';
import { Mood } from './mood';
import { TourTimestamp } from './tour-timestamp';
import { TourTrip } from './tour-trip';
import { Location } from './location';

export interface Tour {
    id?: Guid;
    title?: string;
    description?: string;
    code?: string;
    startDate?: Date;
    endDate?: Date;
    totalPrice?: number;
    status?: string;
    transportations?: Transportation[];
    locationInTours?: Location[];
    tourTimestamps?: TourTimestamp[];
    tourMoods?: Mood[];
    tourTrips?: TourTrip[];
}