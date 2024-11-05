import { Guid } from 'guid-typescript';
import { Photo } from './photo';

export interface Location {
    id?: Guid;
    name?: string;
    description?: string;
    address?: string;
    status?: string;
    temperature?: number;
    longitude?: number;
    latitude?: number;
    photos: Photo[];
}