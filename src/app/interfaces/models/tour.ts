import { Guid } from 'guid-typescript';

export interface Tour {
    id?: Guid;
    code?: string;
    startDate?: Date;
    endDate?: Date;
    totalPrice?: number;
    status?: string;
    title?: string;
    description?: string;
}