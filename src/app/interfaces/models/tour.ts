import { Guid } from 'guid-typescript';
import { Transportation } from './transportation';
import { LocationInTour } from './location-in-tour';
import { Mood } from './mood';

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
    locationInTours?: LocationInTour[];
    tourMoods?: Mood[];
}