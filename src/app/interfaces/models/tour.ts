import { Guid } from 'guid-typescript';
import { Transportation } from './transportation';
import { Location } from './location';
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
    locationInTours?: Location[];
    tourMoods?: Mood[];
}