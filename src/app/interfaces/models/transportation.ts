import { Guid } from 'guid-typescript';

export interface Transportation {
    id?: Guid;
    price?: number;
    capacity?: number;
    type?: string;
    tourId?: Guid;
}