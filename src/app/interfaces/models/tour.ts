import { Guid } from 'guid-typescript';

export interface Tour {
    id?: Guid;
    title?: string;
    description?: string;
    code?: string;
    startDate?: Date;
    endDate?: Date;
    totalPrice?: number;
    status?: string;
}