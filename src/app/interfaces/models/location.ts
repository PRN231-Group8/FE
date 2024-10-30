import { Guid } from 'guid-typescript';

export interface Location {
    id?: Guid;
    name?: string;
    description?: string;
    address?: string;
    status?: string;
    temperature?: number;
}